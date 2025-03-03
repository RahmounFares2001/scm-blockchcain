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
    struct ClientOrder {
        uint256 id;
        uint256 orderId; // Links to Order
        string clientName;
        string clientAddress;
        uint256 clientProductQuantity;
        uint256 shouldArriveToClientAt;
        bool isShippedToClient;
        uint256 shippedToClientAt;
        bool isArrivedToClient;
        uint256 deliveredToClientAt;
    }

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

        string productName;
        uint256 productQuantity;
        uint256 productHash; // productQuantity & createdAt

        string orderStatus;
        uint256 createdAt;
    }

    struct ClientOrderWithOrder {
        ClientOrder clientOrder;
        Order order;
    }


    mapping(uint256 => Order) public orders;
    mapping(uint256 => ClientOrder[]) public clientOrders; // track multiple ClientOrders per Order
    mapping(uint256 => ClientOrder) public clientOrderById; // lookup for a single ClientOrder

    uint256[] public orderIds;
    uint256 private orderCounter = 0;
    uint256 private clientOrderCounter = 0;

    event OrderCreated(
        uint256 indexed id,
        address indexed manufacturerAddress,
        address indexed distributorAddress,
        string productName);
        
    event ClientOrderAdded(
        uint256 indexed clientOrderId,
        uint256 indexed orderId,
        string clientName);

    event OrderDelivered(
        uint256 orderId,
        string clientName,
        uint256 timestamp);

    event OrderShipped(uint256 orderId, uint256 productHash);


    function createOrder(
        address _manufacturerAddress,
        address _distributorAddress,
        string memory _productName,
        uint256 _productQuantity
    ) external onlyAdmin {

        // Fetch manufacturer
        ManufacturerDetails memory manufacturer = getManufacturerByAddress(_manufacturerAddress);
        require(_manufacturerAddress != address(0), "Manufacturer does not exist");

        // Fetch distributor
        DistributorDetails memory distributor = getDistributorByAddress(_distributorAddress);
        require(_distributorAddress != address(0), "Distributor does not exist");

        orderCounter++;

        orders[orderCounter] = Order({
            id: orderCounter,
            manufacturerAddress: _manufacturerAddress,
            manufacturerName: manufacturer.name,
            isProduced: false,
            producedAt: 0,
            isShippedToDistributor: false,
            shippedToDistributorAt: 0,
            distributorAddress: _distributorAddress,
            distributorName: distributor.name,
            isArrivedToDistributor: false,
            arrivedToDistributorAt: 0,
            productName: _productName,
            productQuantity: _productQuantity,
            productHash: 0,
            orderStatus: "Pending Production",
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

    function getOrderByOrderId(uint256 _orderId) public view returns (Order memory) {
        require(_orderId > 0 && _orderId <= orderCounter, "Invalid Order ID");
        return orders[_orderId];
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
        Order[] memory _orders = new Order[](count);
        uint256 index = 0;
        
        for(uint256 i = 0; i < orderCounter; i++) {
            uint256 orderId = i + 1;
            if(orders[orderId].manufacturerAddress == _manufacturerAddress) {
                _orders[index] = orders[orderId];
                index++;
            }
        }

        return _orders;
    }


    function getOrdersByDistributorAddress(address _distributorAddress) public view returns (Order[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (orders[i].distributorAddress == _distributorAddress) {
                count++;
            }
        }

        Order[] memory _orders = new Order[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (orders[i].distributorAddress == _distributorAddress) {
                _orders[index] = orders[i];
                index++;
            }
        }
        return _orders;
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
        
        // Generate product hash 
        orders[_orderId].productHash = createProductHash(
            orders[_orderId].productQuantity,
            orders[_orderId].createdAt,
            orders[_orderId].producedAt,
            orders[_orderId].shippedToDistributorAt
        );
        
        // Update order status
        orders[_orderId].orderStatus = "Shipped to Distributor";
        
        emit OrderShipped(_orderId, orders[_orderId].productHash);
    }

    function confirmArrivalToDistributor(uint256 _orderId) external onlyDistributor {
        require(orders[_orderId].distributorAddress == msg.sender, "Not authorized");
        require(!orders[_orderId].isArrivedToDistributor, "Already confirmed");

        orders[_orderId].isArrivedToDistributor = true;
        orders[_orderId].arrivedToDistributorAt = block.timestamp;
    }



    function addClientOrder(
        uint256 _orderId,
        string memory _clientName,
        string memory _clientAddress,
        uint256 _clientProductQuantity,
        uint256 _shouldArriveToClientAt
    ) external onlyDistributor {
        require(_orderId > 0 && _orderId <= orderCounter, "Invalid Order ID");
        Order storage order = orders[_orderId];

        require(order.isArrivedToDistributor, "Order not yet at distributor");
        require(_clientProductQuantity <= order.productQuantity, "Not enough stock available");

        // Reduce Order.productQuantity
        order.productQuantity -= _clientProductQuantity;

        clientOrderCounter++;
        ClientOrder memory newClientOrder = ClientOrder({
            id: clientOrderCounter,
            orderId: _orderId,
            clientName: _clientName,
            clientAddress: _clientAddress,
            clientProductQuantity: _clientProductQuantity,
            shouldArriveToClientAt: _shouldArriveToClientAt,
            isShippedToClient: false,
            shippedToClientAt: 0,
            isArrivedToClient: false,
            deliveredToClientAt: 0
        });

        clientOrders[_orderId].push(newClientOrder);
        clientOrderById[clientOrderCounter] = newClientOrder;

        emit ClientOrderAdded(clientOrderCounter, _orderId, _clientName);
    }

    function shipClientOrder(uint256 _clientOrderId) external onlyDistributor {
        require(_clientOrderId > 0 && _clientOrderId <= clientOrderCounter, "Invalid Client Order ID");
        ClientOrder storage clientOrder = clientOrderById[_clientOrderId];

        require(clientOrder.shippedToClientAt == 0, "Already shipped");

        clientOrder.isShippedToClient = true;
        clientOrder.shippedToClientAt = block.timestamp;
    }

    function clientConfirmDelivery(uint256 _clientOrderId) public {
        require(_clientOrderId > 0 && _clientOrderId <= clientOrderCounter, "Invalid Client Order ID");
        ClientOrder storage clientOrder = clientOrderById[_clientOrderId];

        require(!clientOrder.isArrivedToClient, "Already delivered");

        clientOrder.isArrivedToClient = true;
        clientOrder.deliveredToClientAt = block.timestamp;

        emit OrderDelivered(clientOrder.orderId, clientOrder.clientName, block.timestamp);
    }


    function getAllClientOrders() public view returns (ClientOrderWithOrder[] memory) {
        uint256 totalClientOrders = 0;

        // Count all client orders
        for (uint256 i = 1; i <= orderCounter; i++) {
            totalClientOrders += clientOrders[i].length;
        }

        ClientOrderWithOrder[] memory allClientOrders = new ClientOrderWithOrder[](totalClientOrders);
        uint256 index = 0;

        for (uint256 i = 1; i <= orderCounter; i++) {
            for (uint256 j = 0; j < clientOrders[i].length; j++) {
                allClientOrders[index] = ClientOrderWithOrder({
                    clientOrder: clientOrders[i][j],
                    order: orders[i]
                });
                index++;
            }
        }

        return allClientOrders;
    }


    function getOrderDetailsByClientOrderId(uint256 _clientOrderId) public view returns (Order memory, ClientOrder memory) {
        require(_clientOrderId > 0 && _clientOrderId <= clientOrderCounter, "Invalid Client Order ID");
        ClientOrder memory clientOrder = clientOrderById[_clientOrderId];
        Order memory order = orders[clientOrder.orderId];
        return (order, clientOrder);
    }


    function getClientOrderByDistributorAddress(address _distributorAddress) public view returns (ClientOrderWithOrder[] memory) {
        uint256 totalClientOrders = 0;

        // Count client orders for the given distributor
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (orders[i].distributorAddress == _distributorAddress) {
                totalClientOrders += clientOrders[i].length;
            }
        }

        ClientOrderWithOrder[] memory distributorClientOrders = new ClientOrderWithOrder[](totalClientOrders);
        uint256 index = 0;

        // Store client orders for the given distributor
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (orders[i].distributorAddress == _distributorAddress) {
                for (uint256 j = 0; j < clientOrders[i].length; j++) {
                    distributorClientOrders[index] = ClientOrderWithOrder({
                        clientOrder: clientOrders[i][j],
                        order: orders[i]
                    });
                    index++;
                }
            }
        }

        return distributorClientOrders;
    }


    // distributor
    struct DistributorDetails {
        string name;
        string place;
        string emailAddress;
        bool isDeleted;
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
        
        distributors[_distributorAddress] = DistributorDetails({
            name: _name,
            emailAddress: _emailAddress,
            place: _place,
            isDeleted: false });
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
        string[] memory emailAddresses = new string[](length);
        string[] memory places = new string[](length);
        
        for(uint i = 0; i < length; i++) {
            address distributorAddr = distributorAddresses[i];
            addresses[i] = distributorAddr;
            names[i] = distributors[distributorAddr].name;
            emailAddresses[i] = distributors[distributorAddr].emailAddress; 
            places[i] = distributors[distributorAddr].place;
        }
        
        return (addresses, names, emailAddresses, places); 
    }

    function getDistributorByAddress(address distributorAddress) public view returns (DistributorDetails memory) {
        require(users[distributorAddress].isRegistered == true, "Distributor does not exist");
        return distributors[distributorAddress];
    }

    function deleteDistributor(address distributorAddress) external onlyAdmin {
        require(users[distributorAddress].isRegistered, "Distributor not found");
        
        distributors[distributorAddress].isDeleted = true;
    }



    // manufacturer
    struct ManufacturerDetails {
        string name;
        string email;
        string place;
        bool isDeleted;
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
        
        manufacturers[_manufacturerAddress] = ManufacturerDetails({
            name: _name,
            email: _email,
            place: _place,
            isDeleted: false });
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

    function getManufacturerByAddress(address manufacturerAddress) public view returns (ManufacturerDetails memory) {
        require(users[manufacturerAddress].isRegistered == true, "Manufacturer does not exist");
        return manufacturers[manufacturerAddress];
    }


    function deleteManufacturer(address manufacturerAddress) external onlyAdmin {
        require(users[manufacturerAddress].isRegistered, "Manufacturer not found");
        
        suppliers[manufacturerAddress].isDeleted = true;
    }
    


    // suppliers
    struct SupplierDetails {
        string name;
        uint256 reliabilityRating; // 1-5
        string isFraud; // Fraud or Reliable or Under Review
        string place;
        string emailAddress;
        string[] violations;
        bool isDeleted;
    }

    struct RawMaterialWithSupplier {
        RawMaterial material;
        SupplierDetails supplier;
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
            isFraud: "Reliable",
            place: _place,
            emailAddress: _emailAddress, 
            violations: new string[](0),
            isDeleted: false
        });
        
        supplierAddresses.push(_supplierAddress);
    }

    function getAllSuppliers() public view returns (
        address[] memory,
        string[] memory,
        uint256[] memory,
        string[] memory,
        string[] memory,
        string[] memory,  
        string[][] memory 
    ) {
        uint length = supplierAddresses.length;

        address[] memory addresses = new address[](length);
        string[] memory names = new string[](length);
        uint256[] memory ratings = new uint256[](length);
        string[] memory fraudStatuses = new string[](length);
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

    function getSupplierByAddress(address supplierAddress) public view returns (SupplierDetails memory) {
        require(users[supplierAddress].isRegistered == true, "Supplier does not exist");
        return suppliers[supplierAddress];
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
        require(rawMaterailOrders[orderId].isDelivered, "Order not yet delivered");

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

        string memory violation = string(abi.encodePacked("Supplier delayed by ", toString(daysDelayed), " days."));
        suppliers[supplierAddress].violations.push(violation);

        if (confirmDelivery) {
            rawMaterailOrders[orderId].isDelivered = true;
            rawMaterailOrders[orderId].quantityreceived = rawMaterailOrders[orderId].quantityOrdered;
            rawMaterailOrders[orderId].arrivedAt = block.timestamp;
        } else {
            rawMaterailOrders[orderId].isCanceled = true;
        }

    }

    function updateSupplierReliabilityOnQuantity(address supplierAddress, uint orderId, uint256 quantityreceived) external {
        require(rawMaterailOrders[orderId].isDelivered, "Order not yet delivered");
        
        if (rawMaterailOrders[orderId].quantityOrdered < quantityreceived) {
            rawMaterailOrders[orderId].quantityreceived = quantityreceived;

            suppliers[supplierAddress].reliabilityRating = 0;
            suppliers[supplierAddress].isFraud = "Under Review";

            uint256 differenceQuantity = rawMaterailOrders[orderId].quantityOrdered - rawMaterailOrders[orderId].quantityreceived;

            string memory violation = string(abi.encodePacked("Delivered quantity differs by  ", toString(differenceQuantity), " units from the ordered quantity."));
            suppliers[supplierAddress].violations.push(violation);
        }
    }

    function deleteSupplier(address supplierAddress) external onlyAdmin {
        require(users[supplierAddress].isRegistered, "Supplier not found");
        
        suppliers[supplierAddress].isDeleted = true;
    }


    // admin update supplier
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

    // admin confirm new price
    event PriceUpdateConfirmed(uint256 indexed materialId, bool approved);

    function confirmNewRawMaterialPrice(uint256 _id, bool _approve) public onlyAdmin {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");

        RawMaterial storage material = materials[_id];

        require(material.reviewPriceUpdate > 0, "No price update pending review");

        if (_approve == true) {
            material.price = material.reviewPriceUpdate;
        } 

        // reset review fields whether approved or not
        material.reviewPriceUpdate = 0;
        material.reviewReason = "";
        material.isAvailable = true;

        emit PriceUpdateConfirmed(_id, _approve);
    }


    // update supplier Fraud status on quantity problem
    event SupplierFraudStatusUpdated(address indexed supplier, bool isFraud, uint256 newReliabilityRating);

    function setSupplierFraudStatus(address supplierAddress, bool isFraud, uint256 newReliabilityRating) public onlyAdmin {
        require(users[supplierAddress].isRegistered == true, "Supplier does not exist");

        if (isFraud == true) {
            suppliers[supplierAddress].isFraud = "Fraud"; // Mark as Fraud
        } else {
            suppliers[supplierAddress].isFraud = "Reliable"; // Reset to Reliable
        }

        // new reliability rating
        suppliers[supplierAddress].reliabilityRating = newReliabilityRating;

        emit SupplierFraudStatusUpdated(supplierAddress, isFraud, newReliabilityRating);
    }



    // raw material
    struct RawMaterial {
        uint256 id;
        address supplierAddress;
        string name;
        string description;
        uint256 price; // usd
        uint256 quantityAvailable;
        uint256 reviewPriceUpdate;
        bool isAvailable;
        uint256 timestamp;
        string updatePriceRaison;
        uint256[] priceUpdateTimestamps; // track price update timestamps
        string reviewReason; // reason for price review (HIGHER_PRICE / FREQUENT_UPDATES)
        bool isDeleted;
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
    event PriceUpdateRequested(uint256 indexed id, uint256 oldPrice, uint256 newPrice, string reason);
    event PriceUpdateApproved(uint256 indexed id, uint256 newPrice);
    event PriceUpdateRejected(uint256 indexed id);

    string constant HIGHER_PRICE = "HIGHER_PRICE";
    string constant FREQUENT_UPDATES = "FREQUENT_UPDATES";
    uint256 constant SIX_MONTHS = 180 days;
    uint256 constant MAX_PRICE_UPDATES = 2;

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

    // update row material 
    function updateMaterial(
        uint256 _id,
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _quantityAvailable,
        string memory updatePriceRaison
    ) public onlySupplier {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");
        require(isMaterialOwner(_id), "Not the material owner");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        require(_quantityAvailable > 0, "Quantity must be greater than 0");

        RawMaterial storage material = materials[_id];
    
        // Check if price is being updated
        if (_price != material.price) {
            material.updatePriceRaison = updatePriceRaison;
            
            // Check frequency of price updates
            if (hasTooManyPriceUpdates(material)) {
                material.isAvailable = false;
                material.reviewPriceUpdate = _price;
                material.reviewReason = FREQUENT_UPDATES;
                
                emit PriceUpdateRequested(_id, material.price, _price, FREQUENT_UPDATES);
                return;
            }

            // Check if price is higher than other materials
            bool isPriceValid = validateNewPrice(_name, _price);
            if (!isPriceValid) {
                material.isAvailable = false;
                material.reviewPriceUpdate = _price;
                material.reviewReason = HIGHER_PRICE;
                emit PriceUpdateRequested(_id, material.price, _price, HIGHER_PRICE);
                return;
            }

        }

        // Update material if all validations pass
        material.name = _name;
        material.description = _description;
        material.price = _price;
        material.quantityAvailable = _quantityAvailable;
        material.timestamp = block.timestamp;
        // Add timestamp for this price update
        material.priceUpdateTimestamps.push(block.timestamp);
        
        emit MaterialUpdated(_id);
    }




    function getMaterialById(uint256 _id) public view returns (RawMaterial memory) {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");
        return materials[_id];
    }

    function getAllMaterials() public view returns (RawMaterialWithSupplier[] memory) {
        RawMaterialWithSupplier[] memory allMaterials = new RawMaterialWithSupplier[](materialIdCounter);
        uint256 validCount = 0;

        for (uint256 i = 1; i <= materialIdCounter; i++) {
            if (materials[i].id != 0) {  // Check if material exists
                SupplierDetails memory supplier = getSupplierByAddress(materials[i].supplierAddress);

                // new struct: material and supplier
                allMaterials[validCount] = RawMaterialWithSupplier({
                    material: materials[i],
                    supplier: supplier
                });
                validCount++;
            }
        }

        RawMaterialWithSupplier[] memory result = new RawMaterialWithSupplier[](validCount);
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

    function deleteRawMaterial(address rawMaterialAddress, uint256 _materialIdCounter) external onlyAdmin {
        require(users[rawMaterialAddress].isRegistered, "Distributor not found");
        
        materials[_materialIdCounter].isDeleted = true;
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
        uint256 quantityOrdered;
        uint256 quantityreceived;
        uint256 price;

        uint256 shippedAt;
        uint256 shouldArriveAt;
        uint256 arrivedAt;

        bool isShipped;
        bool isDelivered;
        bool isCanceled;
    }

    uint private orderRawMaterialCounter;
    mapping(uint => OrderRawMaterial) public rawMaterailOrders;
    mapping(address => uint[]) public manufacturerOrders;

    event RawMaterialOrderCreated(uint orderId, address manufacturer, address supplier);
    event RawMaterialOrderShipped(uint orderId, uint256 shippedAt);
    event RawMaterialOrderDelivered(uint orderId);

    function createOrderRawMaterial(
        address supplierAddress,
        address manufacturerAddress,
        string memory materialName,
        string memory materialId,
        uint256 quantityOrdered,
        uint256 price,
        uint256 shouldArriveAt
    ) external {
        // Fetch supplier
        SupplierDetails memory supplier = getSupplierByAddress(supplierAddress);
        require(supplierAddress != address(0), "Supplier does not exist");

        // Fetch manufacturer
        ManufacturerDetails memory manufacturer = getManufacturerByAddress(manufacturerAddress);
        require(manufacturerAddress != address(0), "Manufacturer does not exist");


        orderRawMaterialCounter++;
        rawMaterailOrders[orderRawMaterialCounter] = OrderRawMaterial({
            id: orderRawMaterialCounter,
            supplierAddress: supplierAddress,
            supplierName: supplier.name,
            manufacturerAddress: manufacturerAddress,
            manufacturerName: manufacturer.name,
            materialName: materialName,
            materialId: materialId,
            quantityOrdered: quantityOrdered,
            quantityreceived: 0,
            price: price,
            shippedAt: 0,
            shouldArriveAt: shouldArriveAt,
            arrivedAt: 0,
            isShipped: false,
            isDelivered: false,
            isCanceled: false
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
        rawMaterailOrders[orderId].quantityreceived = rawMaterailOrders[orderId].quantityOrdered;
        rawMaterailOrders[orderId].arrivedAt = block.timestamp;
        emit RawMaterialOrderDelivered(orderId);
    }

    function getAllManufacturerRawMaterials(address manufacturer) external view returns (uint[] memory) {
        return manufacturerOrders[manufacturer];
    }





    // helpers functions 
    // validators
    function validateNewPrice(string memory _name, uint256 _newPrice) internal view returns (bool) {
        for (uint256 i = 1; i <= materialIdCounter; i++) {
            if (keccak256(bytes(materials[i].name)) == keccak256(bytes(_name)) && 
                !materials[i].isDeleted && 
                materials[i].isAvailable) {
                if (_newPrice > materials[i].price) {
                    return false;
                }
            }
        }
        return true;
    }

    function hasTooManyPriceUpdates(RawMaterial storage material) internal view returns (bool) {
        uint256 updateCount = 0;
        uint256 sixMonthsAgo = block.timestamp - SIX_MONTHS;

        for (uint256 i = 0; i < material.priceUpdateTimestamps.length; i++) {
            if (material.priceUpdateTimestamps[i] > sixMonthsAgo) {
                updateCount++;
                if (updateCount >= MAX_PRICE_UPDATES) {
                    return true;
                }
            }
        }
        return false;
    }


    // check if he is the material owner
    function isMaterialOwner(uint256 _id) internal view returns (bool) {
        // Get the array of materials owned by the message sender
        uint256[] storage supplierMaterials = supplierToMaterials[msg.sender];
        for (uint256 i = 0; i < supplierMaterials.length; i++) {
            if (supplierMaterials[i] == _id) {
                return true;
            }
        }
        return false;
    }

    // Helper function to convert uint to string
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }

    // Helper function to get review reason (for admin interface)
    function getReviewReason(uint256 _id) public view returns (string memory) {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");
        return materials[_id].reviewReason;
    }


    // create hash from order details
    function createProductHash(uint256 quantity, uint256 createdAt, uint256 producedAt, uint256 shippedAt) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(quantity, createdAt, producedAt, shippedAt)));
    }
}