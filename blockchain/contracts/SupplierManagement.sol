// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract SupplierManagement {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;

    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(dataStructures.getUser(msg.sender).role == DataStructures.Role.ADMIN, "Not authorized");
        _;
    }

    // Modifier to restrict access to supplier
    modifier onlySupplier() {
        require(dataStructures.getUser(msg.sender).role == DataStructures.Role.SUPPLIER, "Only suppliers can perform this action");
        _;
    }

    // Function to add a violation to a supplier
    function addViolation(address _supplierAddress, string memory _violation) public onlyAdmin {
        require(dataStructures.getUser(_supplierAddress).isRegistered, "Supplier not registered");

        // Get the supplier details from storage
        DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(_supplierAddress);

        // Create a new array in memory with one additional slot
        string[] memory newViolations = new string[](supplier.violations.length + 1);

        // Copy the existing violations to the new array
        for (uint i = 0; i < supplier.violations.length; i++) {
            newViolations[i] = supplier.violations[i];
        }

        // Add the new violation to the end of the array
        newViolations[newViolations.length - 1] = _violation;

        // Update the supplier's violations in storage
        supplier.violations = newViolations;
        dataStructures.addSupplier(_supplierAddress, supplier);
    }

    // Function to get violations by supplier address
    function getViolationsBySupplierAddress(address _supplierAddress) public view returns (string[] memory) {
        require(dataStructures.getUser(_supplierAddress).isRegistered, "Supplier not registered");
        return dataStructures.getSupplier(_supplierAddress).violations;
    }

    // Function to update supplier reliability on delay
    function updateSupplierReliabilityOnDelay(address supplierAddress, uint orderId, bool confirmDelivery) external {
        DataStructures.OrderRawMaterial memory order = dataStructures.getRawMaterialOrder(orderId);
        uint256 delay = order.arrivedAt - order.shouldArriveAt;
        uint256 daysDelayed = delay / 1 days;

        if (daysDelayed > 0) {
            uint256 penalty = daysDelayed / 10; // 0.1 per day

            DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(supplierAddress);
            if (supplier.reliabilityRating > penalty) {
                supplier.reliabilityRating -= penalty;
            } else {
                supplier.reliabilityRating = 0;
            }

            if (supplier.reliabilityRating < 3) {
                supplier.isFraud = "Fraud";
            }

            // Create a new array in memory with one additional slot
            string[] memory newViolations = new string[](supplier.violations.length + 1);

            // Copy the existing violations to the new array
            for (uint i = 0; i < supplier.violations.length; i++) {
                newViolations[i] = supplier.violations[i];
            }

            // Add the new violation to the end of the array
            string memory violation = string(abi.encodePacked("Supplier delayed by ", helperFunctions.toString(daysDelayed), " days."));
            newViolations[newViolations.length - 1] = violation;

            // Update the supplier's violations in storage
            supplier.violations = newViolations;
            dataStructures.addSupplier(supplierAddress, supplier);
        }

        if (confirmDelivery) {
            order.status = "Delivered";
            order.quantityreceived = order.quantityOrdered;
            order.arrivedAt = block.timestamp;
        } else {
            order.status = "Canceled";
        }
        dataStructures.addRawMaterialOrder(orderId, order);
    }

    // Function to update supplier reliability on quantity
    function updateSupplierReliabilityOnQuantity(address supplierAddress, uint orderId, uint256 quantityreceived) external {
        DataStructures.OrderRawMaterial memory order = dataStructures.getRawMaterialOrder(orderId);

        if (order.quantityOrdered < quantityreceived) {
            order.quantityreceived = quantityreceived;

            DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(supplierAddress);
            supplier.reliabilityRating = 0;
            supplier.isFraud = "Under Review";

            // Create a new array in memory with one additional slot
            string[] memory newViolations = new string[](supplier.violations.length + 1);

            // Copy the existing violations to the new array
            for (uint i = 0; i < supplier.violations.length; i++) {
                newViolations[i] = supplier.violations[i];
            }

            // Add the new violation to the end of the array
            uint256 differenceQuantity = order.quantityOrdered - order.quantityreceived;
            string memory violation = string(abi.encodePacked("Delivered quantity differs by  ", helperFunctions.toString(differenceQuantity), " units from the ordered quantity."));
            newViolations[newViolations.length - 1] = violation;

            // Update the supplier's violations in storage
            supplier.violations = newViolations;
            dataStructures.addSupplier(supplierAddress, supplier);
        }
    }

    // Function to update supplier details
    function updateSupplier(
        address supplierAddress,
        string memory name,
        uint256 reliabilityRating,
        string memory isFraud,
        string memory place,
        string memory emailAddress
    ) external onlyAdmin {
        require(dataStructures.getUser(supplierAddress).isRegistered, "Supplier not found");

        DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(supplierAddress);
        supplier.name = name;
        supplier.place = place;
        supplier.emailAddress = emailAddress;
        supplier.reliabilityRating = reliabilityRating;
        supplier.isFraud = isFraud;

        dataStructures.addSupplier(supplierAddress, supplier);
    }

    // 
    event PriceUpdateConfirmed(uint256 indexed materialId, bool approved);
    event SupplierFraudStatusUpdated(address indexed supplier, bool isFraud, uint256 newReliabilityRating);
    event MaterialAdded(uint256 indexed id, address indexed supplier);
    // Function to confirm new raw material price
    function confirmNewRawMaterialPrice(uint256 _id, bool _approve) public onlyAdmin {
        require(_id > 0 && _id <= dataStructures.getMaterialIdCounter(), "Invalid material ID");

        DataStructures.RawMaterial memory material = dataStructures.getMaterial(_id);
        require(material.reviewPriceUpdate > 0, "No price update pending review");

        if (_approve) {
            material.price = material.reviewPriceUpdate;
        }

        material.reviewPriceUpdate = 0;
        material.reviewReason = "";
        material.isAvailable = true;

        dataStructures.addMaterial(_id, material);
        emit PriceUpdateConfirmed(_id, _approve);
    }

    // Function to set supplier fraud status
    function setSupplierFraudStatus(address supplierAddress, bool isFraud, uint256 newReliabilityRating) public onlyAdmin {
        require(dataStructures.getUser(supplierAddress).isRegistered, "Supplier does not exist");

        DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(supplierAddress);
        if (isFraud) {
            supplier.isFraud = "Fraud";
        } else {
            supplier.isFraud = "Reliable";
        }

        supplier.reliabilityRating = newReliabilityRating;
        dataStructures.addSupplier(supplierAddress, supplier);

        emit SupplierFraudStatusUpdated(supplierAddress, isFraud, newReliabilityRating);
    }

    // Function to add a new material
    function addMaterial(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantityAvailable
    ) public onlySupplier returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(_quantityAvailable > 0, "Quantity must be greater than 0");

        uint256 newMaterialId = dataStructures.getMaterialIdCounter() + 1;
        dataStructures.setMaterialIdCounter(newMaterialId);

        DataStructures.RawMaterial memory newMaterial = DataStructures.RawMaterial({
            id: newMaterialId,
            supplierAddress: msg.sender,
            name: _name,
            description: _description,
            price: _price,
            quantityAvailable: _quantityAvailable,
            reviewPriceUpdate: 0,
            isAvailable: true,
            timestamp: block.timestamp,
            updatePriceRaison: "",
            priceUpdateTimestamps: new uint256[](0),
            reviewReason: "",
            isDeleted: false
        });

        dataStructures.addMaterial(newMaterialId, newMaterial);
        dataStructures.addSupplierMaterial(msg.sender, newMaterialId);

        emit MaterialAdded(newMaterialId, msg.sender);

        return newMaterialId;
    }
}