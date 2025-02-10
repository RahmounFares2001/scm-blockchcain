// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract Transactions {
    uint256 transactionCount;
    

    // admin creation
    address public admin;
    enum Role { ADMIN, SUPPLIER, MANUFACTURER, DISTRIBUTOR }

    struct User {
        address userAddress;
        Role role;
        bool isRegistered;
    }

    mapping(address => User) public users;
    bool public adminCreated = false;

    constructor(address _adminAddress) {
        require(!adminCreated, "Admin already created");
        require(_adminAddress != address(0), "Invalid admin address");

        admin = _adminAddress;
        users[_adminAddress] = User({
            userAddress: _adminAddress,
            role: Role.ADMIN,
            isRegistered: true
        });
        adminCreated = true;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    // orders
    struct Order {
        uint256 id;
        address manufacturerAddress;
        string manufacturerName;
        bool isProduced;
        uint256 producedAt;
        bool isShippedToDistributor; 
        uint256 shippedToDistributorAt;


        address distributorAddress;
        string distributorName;
        bool isArrivedToDistributor; 
        uint256 arrivedToDistributorAt;
        uint256 shippedToClientAt;
        uint256 deliveredToClientAt;

        string clientName;
        string[] clientAddress;

        string productName;
        string productQuantity;
        
        string orderStatus;
        uint256 createdAt;
    }


    mapping(uint256 => Order) public orders;
    uint256[] public orderIds;

    event OrderCreated(
        uint256 indexed id,
        address indexed manufacturerAddress,
        address indexed distributorAddress,
        string productName
    );


    uint256 private orderCounter = 0; 

    function createOrder(
        address _manufacturerAddress,
        string memory _manufacturerName,
        address _distributorAddress,
        string memory _distributorName,
        string memory _productName,
        string memory _productQuantity
    ) external onlyAdmin {
        orderCounter++;
        
        orders[orderCounter] = Order({
            id: orderCounter,
            manufacturerAddress: _manufacturerAddress,
            manufacturerName: _manufacturerName,
            isProduced: false,
            producedAt: 0,
            isShippedToDistributor: false,
            shippedToDistributorAt: 0,
            distributorAddress: _distributorAddress,
            distributorName: _distributorName,
            isArrivedToDistributor: false,
            arrivedToDistributorAt: 0,
            shippedToClientAt: 0,
            deliveredToClientAt: 0,
            clientName: "",
            clientAddress: new string[](0),
            productName: _productName,
            productQuantity: _productQuantity,
            orderStatus: "pendingProduction",
            createdAt: block.timestamp
        });

        orderIds.push(orderCounter);
        emit OrderCreated(orderCounter, _manufacturerAddress, _distributorAddress, _productName);
    }


    function getAllOrders() external view returns (Order[] memory) {
        Order[] memory allOrders = new Order[](orderCounter);
        
        for(uint256 i = 0; i < orderCounter; i++) {
            allOrders[i] = orders[i + 1]; // IDs start with 1
        }
        
        return allOrders;
    }


    function getOrderByManufacturerAddress(address _manufacturerAddress) 
        external view returns (Order[] memory) 
    {
        uint256 count = 0;
        
        // count nb of orders
        for(uint256 i = 0; i < orderCounter; i++) {
            if(orders[i + 1].manufacturerAddress == _manufacturerAddress) {
                count++;
            }
        }

        // result table
        Order[] memory manufacturerOrderss = new Order[](count);
        uint256 index = 0;
        
        for(uint256 i = 0; i < orderCounter; i++) {
            uint256 orderId = i + 1;
            if(orders[orderId].manufacturerAddress == _manufacturerAddress) {
                manufacturerOrderss[index] = orders[orderId];
                index++;
            }
        }

        return manufacturerOrderss;
    }


    function produceProduct(uint256 _orderId) external onlyManufacturer {
        require(orders[_orderId].manufacturerAddress == msg.sender, "Unauthorized: Not your order");
        require(orders[_orderId].isProduced == false, "Order already produced");

        orders[_orderId].isProduced = true;
        orders[_orderId].producedAt = block.timestamp;
    }

    function shipProductToDistributor(uint256 _orderId) external onlyManufacturer {
        require(orders[_orderId].manufacturerAddress == msg.sender, "Not authorized");
        require(orders[_orderId].isProduced, "Order not produced yet");
        require(!orders[_orderId].isShippedToDistributor, "Already shipped");

        orders[_orderId].isShippedToDistributor = true;
        orders[_orderId].shippedToDistributorAt = block.timestamp;
    }

    function confirmArrivalToDistributor(uint256 _orderId) external onlyDistributor {
        require(orders[_orderId].distributorAddress == msg.sender, "Not authorized");
        require(!orders[_orderId].isArrivedToDistributor, "Already confirmed");

        orders[_orderId].isArrivedToDistributor = true;
        orders[_orderId].arrivedToDistributorAt = block.timestamp;
    }


    function shipClientDelivery(
        uint256 _orderId,
        string memory _clientName,
        string[] memory _clientAddress,
        uint256 _deliveredToClientAt
    ) external onlyDistributor {
        require(orders[_orderId].distributorAddress == msg.sender, "Not authorized");
        require(orders[_orderId].isArrivedToDistributor, "Order not arrived at distributor yet");
        require(orders[_orderId].deliveredToClientAt == 0, "Order already delivered");

        orders[_orderId].clientName = _clientName;
        orders[_orderId].clientAddress = _clientAddress;
        orders[_orderId].deliveredToClientAt = _deliveredToClientAt;

        
        if (orders[_orderId].shippedToClientAt == 0) {
            orders[_orderId].shippedToClientAt = block.timestamp;
        }
        
    }



    // distributor
    struct DistributorDetails {
        string name;
        string place;
        string emailAddress;
    }

    modifier onlyDistributor() {
        require(users[msg.sender].role == Role.DISTRIBUTOR, "Only distributor can perform this action");
        _;
    }
    
    mapping(address => DistributorDetails) public distributors;
    address[] public distributorAddresses; // Pour suivre tous les distributeurs


    function createDistributor(
        address _distributorAddress,
        string memory _name,
        string memory _emailAddress,
        string memory _place
    ) public onlyAdmin {
        require(_distributorAddress != address(0), "Invalid address");
        require(!users[_distributorAddress].isRegistered, "User already exists");
        
        users[_distributorAddress] = User({
            userAddress: _distributorAddress,
            role: Role.DISTRIBUTOR,
            isRegistered: true
        });
        
        distributors[_distributorAddress] = DistributorDetails(_name, _emailAddress, _place);
        distributorAddresses.push(_distributorAddress);
    }

    
    function getAllDistributors() public view returns (
        address[] memory,
        string[] memory,
        string[] memory,
        string[] memory
    ) {
        uint length = distributorAddresses.length;
        
        address[] memory addresses = new address[](length);
        string[] memory names = new string[](length);
        string[] memory emailAddress = new string[](length);
        string[] memory places = new string[](length);
        
        for(uint i = 0; i < length; i++) {
            address distributorAddr = distributorAddresses[i];
            addresses[i] = distributorAddr;
            names[i] = distributors[distributorAddr].name;
            places[i] = distributors[distributorAddr].place;
        }
        
        return (addresses, names, places, emailAddress);
    }



    // manufacturer
    struct ManufacturerDetails {
        string name;
        string email;
        string place;
    }

    modifier onlyManufacturer() {
        require(users[msg.sender].role == Role.MANUFACTURER, "Only manufacturer can perform this action");
        _;
    }

    mapping(address => ManufacturerDetails) public manufacturers;
    address[] public manufacturerAddresses;


    function createManufacturer(
        address _manufacturerAddress,
        string memory _name,
        string memory _email,
        string memory _place
    ) public onlyAdmin {
        require(_manufacturerAddress != address(0), "Invalid address");
        require(!users[_manufacturerAddress].isRegistered, "User already exists");
        
        users[_manufacturerAddress] = User({
            userAddress: _manufacturerAddress,
            role: Role.MANUFACTURER,
            isRegistered: true
        });
        
        manufacturers[_manufacturerAddress] = ManufacturerDetails(_name, _email, _place);
        manufacturerAddresses.push(_manufacturerAddress);
    }


    function getAllManufacturers() public view returns (
        address[] memory,
        string[] memory,
        string[] memory,
        string[] memory

    ) {
        uint length = manufacturerAddresses.length;
        
        address[] memory addresses = new address[](length);
        string[] memory names = new string[](length);
        string[] memory emails = new string[](length);
        string[] memory places = new string[](length);
        
        for(uint i = 0; i < length; i++) {
            address manufacturerAddr = manufacturerAddresses[i];
            addresses[i] = manufacturerAddr;
            names[i] = manufacturers[manufacturerAddr].name;
            emails[i] = manufacturers[manufacturerAddr].email;
            places[i] = manufacturers[manufacturerAddr].place;
        }
        
        return (addresses, names, emails, places);
    }
    


    // suppliers
    struct SupplierDetails {
        string name;
        uint256 reliabilityRating; // 1-5
        bool isFraud; // is supplier fraud
        string place;
        string emailAddress;
        string[] violations; // المخالفات
    }

    mapping(address => SupplierDetails) public suppliers;
    address[] public supplierAddresses;

    function createSupplier(
        address _supplierAddress,
        string memory _name,
        string memory _place,
        string memory _emailAddress  
    ) public onlyAdmin {
        require(_supplierAddress != address(0), "Invalid address");
        require(!users[_supplierAddress].isRegistered, "User already exists");
        
        users[_supplierAddress] = User({
            userAddress: _supplierAddress,
            role: Role.SUPPLIER,
            isRegistered: true
        });
        
        suppliers[_supplierAddress] = SupplierDetails({
            name: _name,
            reliabilityRating: 5,
            isFraud: false,
            place: _place,
            emailAddress: _emailAddress, 
            violations: new string[](0)
        });
        
        supplierAddresses.push(_supplierAddress);
    }

    function getAllSuppliers() public view returns (
        address[] memory,
        string[] memory,
        uint256[] memory,
        bool[] memory,
        string[] memory,
        string[] memory,  
        string[][] memory 
    ) {
        uint length = supplierAddresses.length;

        address[] memory addresses = new address[](length);
        string[] memory names = new string[](length);
        uint256[] memory ratings = new uint256[](length);
        bool[] memory fraudStatuses = new bool[](length);
        string[] memory places = new string[](length);
        string[] memory emails = new string[](length);  
        string[][] memory allViolations = new string[][](length);  

        for (uint i = 0; i < length; i++) {
            address supplierAddr = supplierAddresses[i];
            addresses[i] = supplierAddr;
            names[i] = suppliers[supplierAddr].name;
            ratings[i] = suppliers[supplierAddr].reliabilityRating;
            fraudStatuses[i] = suppliers[supplierAddr].isFraud;
            places[i] = suppliers[supplierAddr].place;
            emails[i] = suppliers[supplierAddr].emailAddress; 
            allViolations[i] = suppliers[supplierAddr].violations;
        }

        return (addresses, names, ratings, fraudStatuses, places, emails, allViolations);
    }

    function addViolation(address _supplierAddress, string memory _violation) public onlyAdmin {
        require(users[_supplierAddress].isRegistered, "Supplier not registered");

        suppliers[_supplierAddress].violations.push(_violation);
    }




    function updateSupplierReliability(address supplierAddress, uint orderId) external onlyAdmin {
        require(rawMaterailOrders[orderId].isDelivered, "Order not yet delivered");

        uint256 delay = rawMaterailOrders[orderId].arrivedAt - rawMaterailOrders[orderId].shouldArriveAt;
        uint256 daysDelayed = delay / 1 days;
        
        if (daysDelayed > 0) {
            suppliers[supplierAddress].reliabilityRating = suppliers[supplierAddress].reliabilityRating > (daysDelayed * 10) / 100
                ? suppliers[supplierAddress].reliabilityRating - (daysDelayed * 10) / 100 : 0;
        }

        if (suppliers[supplierAddress].reliabilityRating < 3) {
            suppliers[supplierAddress].isFraud = true;
        }
    }


    // raw material
    struct RawMaterial {
        uint256 id;
        string name;
        string description;
        uint256 price; // usd
        uint256 quantityAvaible;
        uint256 timestamp;
    }

    modifier onlySupplier() {
        require(users[msg.sender].isRegistered && users[msg.sender].role == Role.SUPPLIER, "Only suppliers can perform this action");
        _;
    }

    mapping(uint256 => RawMaterial) public materials;
    mapping(address => uint256[]) public supplierToMaterials;
    uint256 private materialIdCounter = 0;

    event MaterialAdded(uint256 indexed id, address indexed supplier);
    event MaterialUpdated(uint256 indexed id);

    function addMaterial(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantityAvaible
    ) public onlySupplier returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(_quantityAvaible > 0, "Quantity must be greater than 0");

        materialIdCounter++;
        
        materials[materialIdCounter] = RawMaterial({
            id: materialIdCounter,
            name: _name,
            description: _description,
            price: _price,
            quantityAvaible: _quantityAvaible,
            timestamp: block.timestamp
        });

        supplierToMaterials[msg.sender].push(materialIdCounter);
        
        emit MaterialAdded(materialIdCounter, msg.sender);
        
        return materialIdCounter;
    }

    function updateMaterial(
        uint256 _id,
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantityAvaible
    ) public onlySupplier {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");
        require(isMaterialOwner(_id), "Not the material owner");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(_quantityAvaible > 0, "Quantity must be greater than 0");

        RawMaterial storage material = materials[_id];
        
        material.name = _name;
        material.description = _description;
        material.price = _price;
        material.quantityAvaible = _quantityAvaible;
        material.timestamp = block.timestamp;
        
        emit MaterialUpdated(_id);
    }

    function getMaterial(uint256 _id) public view returns (RawMaterial memory) {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");
        return materials[_id];
    }

    function getAllMaterials() public view returns (RawMaterial[] memory) {
        RawMaterial[] memory allMaterials = new RawMaterial[](materialIdCounter);
        uint256 validCount = 0;

        for (uint256 i = 1; i <= materialIdCounter; i++) {
            if (materials[i].id != 0) {  // Check if material exists
                allMaterials[validCount] = materials[i];
                validCount++;
            }
        }

        RawMaterial[] memory result = new RawMaterial[](validCount);
        for (uint256 i = 0; i < validCount; i++) {
            result[i] = allMaterials[i];
        }

        return result;
    }

    function getSupplierMaterials() public view returns (RawMaterial[] memory) {
        uint256[] storage supplierMaterialIds = supplierToMaterials[msg.sender];
        RawMaterial[] memory result = new RawMaterial[](supplierMaterialIds.length);
        
        for (uint256 i = 0; i < supplierMaterialIds.length; i++) {
            result[i] = materials[supplierMaterialIds[i]];
        }
        
        return result;
    }

    function isMaterialOwner(uint256 _id) internal view returns (bool) {
        uint256[] storage supplierMaterials = supplierToMaterials[msg.sender];
        for (uint256 i = 0; i < supplierMaterials.length; i++) {
            if (supplierMaterials[i] == _id) {
                return true;
            }
        }
        return false;
    }

    // order raw material
    struct OrderRawMaterial {
        uint id;
        address supplierAddress;
        string supplierName;

        address manufacturerAddress;
        string manufacturerName;

        string materialName;
        string materialId;
        uint256 quantity;
        uint256 price;

        uint256 shippedAt;
        uint256 shouldArriveAt;
        uint256 arrivedAt;

        bool isShipped;
        bool isDelivered;
    }

    uint private orderRawMaterialCounter;
    mapping(uint => OrderRawMaterial) public rawMaterailOrders;
    mapping(address => uint[]) public manufacturerOrders;

    event RawMaterialOrderCreated(uint orderId, address manufacturer, address supplier);
    event RawMaterialOrderShipped(uint orderId, uint256 shippedAt);
    event RawMaterialOrderDelivered(uint orderId);

    function createOrderRawMaterial(
        address supplierAddress,
        string memory supplierName,
        address manufacturerAddress,
        string memory manufacturerName,
        string memory materialName,
        string memory materialId,
        uint256 quantity,
        uint256 price,
        uint256 shouldArriveAt
    ) external {
        orderRawMaterialCounter++;
        rawMaterailOrders[orderRawMaterialCounter] = OrderRawMaterial({
            id: orderRawMaterialCounter,
            supplierAddress: supplierAddress,
            supplierName: supplierName,
            manufacturerAddress: manufacturerAddress,
            manufacturerName: manufacturerName,
            materialName: materialName,
            materialId: materialId,
            quantity: quantity,
            price: price,
            shippedAt: 0,
            shouldArriveAt: shouldArriveAt,
            arrivedAt: 0,
            isShipped: false,
            isDelivered: false
        });
        manufacturerOrders[manufacturerAddress].push(orderRawMaterialCounter);
        emit RawMaterialOrderCreated(orderRawMaterialCounter, manufacturerAddress, supplierAddress);
    }

    function shipRawMaterial(uint orderId) external {
        require(!rawMaterailOrders[orderId].isShipped, "Already shipped");
        rawMaterailOrders[orderId].isShipped = true;
        rawMaterailOrders[orderId].shippedAt = block.timestamp;
        emit RawMaterialOrderShipped(orderId, block.timestamp);
    }

    function confirmRawMaterialReception(uint orderId) external {
        require(rawMaterailOrders[orderId].isShipped, "Not yet shipped");
        require(!rawMaterailOrders[orderId].isDelivered, "Already delivered");
        rawMaterailOrders[orderId].isDelivered = true;
        rawMaterailOrders[orderId].arrivedAt = block.timestamp;
        emit RawMaterialOrderDelivered(orderId);
    }

    function getAllManufacturerRawMaterials(address manufacturer) external view returns (uint[] memory) {
        return manufacturerOrders[manufacturer];
    }
}