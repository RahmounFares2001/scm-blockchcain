// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract SupplierManagement is DataStructures {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;

    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    function addViolation(address _supplierAddress, string memory _violation) public onlyAdmin {
        require(users[_supplierAddress].isRegistered, "Supplier not registered");
        suppliers[_supplierAddress].violations.push(_violation);
    }

    function getViolationsBySupplierAddress(address _supplierAddress) public view returns (string[] memory) {
        require(users[_supplierAddress].isRegistered, "Supplier not registered");
        return suppliers[_supplierAddress].violations;
    }

    function updateSupplierReliabilityOnDelay(address supplierAddress, uint orderId, bool confirmDelivery) external {

        uint256 delay = rawMaterailOrders[orderId].arrivedAt - rawMaterailOrders[orderId].shouldArriveAt;
        uint256 daysDelayed = delay / 1 days;

        if (daysDelayed > 0) {
            uint256 penalty = daysDelayed / 10; // 0.1 per day

            if (suppliers[supplierAddress].reliabilityRating > penalty) {
                suppliers[supplierAddress].reliabilityRating -= penalty;
            } else {
                suppliers[supplierAddress].reliabilityRating = 0;
            }
        }

        if (suppliers[supplierAddress].reliabilityRating < 3) {
            suppliers[supplierAddress].isFraud = "Fraud";
        }

        string memory violation = string(abi.encodePacked("Supplier delayed by ", helperFunctions.toString(daysDelayed), " days."));
        suppliers[supplierAddress].violations.push(violation);

        if (confirmDelivery) {
            rawMaterailOrders[orderId].status = "Delivered";
            rawMaterailOrders[orderId].quantityreceived = rawMaterailOrders[orderId].quantityOrdered;
            rawMaterailOrders[orderId].arrivedAt = block.timestamp;
        } else {
            rawMaterailOrders[orderId].status = "Canceled";
        }
    }

    function updateSupplierReliabilityOnQuantity(address supplierAddress, uint orderId, uint256 quantityreceived) external {
        // require(
        //     keccak256(abi.encodePacked(rawMaterailOrders[orderId].status)) == keccak256(abi.encodePacked("Delivered")),
        //     "Order not yet delivered"
        // );
        
        if (rawMaterailOrders[orderId].quantityOrdered < quantityreceived) {
            rawMaterailOrders[orderId].quantityreceived = quantityreceived;

            suppliers[supplierAddress].reliabilityRating = 0;
            suppliers[supplierAddress].isFraud = "Under Review";

            uint256 differenceQuantity = rawMaterailOrders[orderId].quantityOrdered - rawMaterailOrders[orderId].quantityreceived;

            string memory violation = string(abi.encodePacked("Delivered quantity differs by  ", helperFunctions.toString(differenceQuantity), " units from the ordered quantity."));
            suppliers[supplierAddress].violations.push(violation);
        }
    }

    function updateSupplier(
        address supplierAddress,
        string memory name,
        uint256 reliabilityRating,
        string memory isFraud,
        string memory place,
        string memory emailAddress
    ) external onlyAdmin {
        require(users[supplierAddress].isRegistered == true, "Supplier not found");

        suppliers[supplierAddress].name = name; 
        suppliers[supplierAddress].place = place;
        suppliers[supplierAddress].emailAddress = emailAddress;
        
        suppliers[supplierAddress].reliabilityRating = reliabilityRating;
        suppliers[supplierAddress].isFraud = isFraud;
    }

    function confirmNewRawMaterialPrice(uint256 _id, bool _approve) public onlyAdmin {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");

        RawMaterial storage material = materials[_id];

        require(material.reviewPriceUpdate > 0, "No price update pending review");

        if (_approve == true) {
            material.price = material.reviewPriceUpdate;
        } 

        material.reviewPriceUpdate = 0;
        material.reviewReason = "";
        material.isAvailable = true;

        emit PriceUpdateConfirmed(_id, _approve);
    }

    function setSupplierFraudStatus(address supplierAddress, bool isFraud, uint256 newReliabilityRating) public onlyAdmin {
        require(users[supplierAddress].isRegistered == true, "Supplier does not exist");

        if (isFraud == true) {
            suppliers[supplierAddress].isFraud = "Fraud"; 
        } else {
            suppliers[supplierAddress].isFraud = "Reliable"; 
        }

        suppliers[supplierAddress].reliabilityRating = newReliabilityRating;

        emit SupplierFraudStatusUpdated(supplierAddress, isFraud, newReliabilityRating);
    }

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

        materialIdCounter++;
        
        materials[materialIdCounter] = RawMaterial({
            id: materialIdCounter,
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

        supplierToMaterials[msg.sender].push(materialIdCounter);
        
        emit MaterialAdded(materialIdCounter, msg.sender);
        
        return materialIdCounter;
    }


}