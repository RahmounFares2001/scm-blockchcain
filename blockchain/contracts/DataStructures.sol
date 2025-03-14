// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract DataStructures {
    // Enum
    enum Role { ADMIN, SUPPLIER, MANUFACTURER, DISTRIBUTOR }

    // Structs
    struct User {
        address userAddress;
        Role role;
        bool isRegistered;
    }

    struct ClientOrder {
        uint256 id;
        uint256 orderId;
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
        bool isProduced;
        uint256 producedAt;
        bool isShippedToDistributor;
        uint256 shippedToDistributorAt;
        address distributorAddress;
        bool isArrivedToDistributor;
        uint256 arrivedToDistributorAt;
        string productName;
        uint256 productQuantity;
        uint256 productHash;
        string orderStatus;
    }

    struct ClientOrderWithOrder {
        ClientOrder clientOrder;
        Order order;
    }

    struct DistributorDetails {
        string name;
        string place;
        string emailAddress;
        bool isDeleted;
    }

    struct ManufacturerDetails {
        string name;
        string email;
        string place;
        bool isDeleted;
    }

    struct SupplierDetails {
        string name;
        uint256 reliabilityRating;
        string isFraud;
        string place;
        string emailAddress;
        string[] violations;
        bool isDeleted;
    }

    struct RawMaterial {
        uint256 id;
        address supplierAddress;
        string name;
        string description;
        uint256 price;
        uint256 quantityAvailable;
        uint256 reviewPriceUpdate;
        bool isAvailable;
        uint256 timestamp;
        string updatePriceRaison;
        uint256[] priceUpdateTimestamps;
        string reviewReason;
        bool isDeleted;
    }

    struct RawMaterialWithSupplier {
        RawMaterial material;
        SupplierDetails supplier;
    }

    struct OrderRawMaterial {
        uint id;
        address supplierAddress;
        address manufacturerAddress;
        string materialName;
        string materialId;
        uint256 quantityOrdered;
        uint256 quantityreceived;
        uint256 price;
        uint256 shippedAt;
        uint256 shouldArriveAt;
        uint256 arrivedAt;
        string status; // Shipped, Delivered, Canceled
    }

    // Mappings
    mapping(address => User) internal users;
    mapping(address => DistributorDetails) public distributors;
    mapping(address => ManufacturerDetails) public manufacturers;
    mapping(address => SupplierDetails) public suppliers;
    mapping(uint256 => RawMaterial) public materials;
    mapping(address => uint256[]) public supplierToMaterials;
    mapping(address => uint[]) public manufacturerOrders;

    mapping(uint256 => Order) public orders;
    mapping(uint256 => ClientOrder[]) public clientOrders;
    mapping(uint256 => ClientOrder) public clientOrderById;
    mapping(uint => OrderRawMaterial) public rawMaterailOrders;

    // Helper function to access rawMaterailOrders
    // Helper function to update rawMaterailOrders (directly modifies storage)
    function updateRawMaterialOrder(uint _orderId, OrderRawMaterial memory _order) external {
        rawMaterailOrders[_orderId] = _order;
    }

    // Setter for orders
    function setOrder(uint256 _orderId, Order memory _order) external {
        orders[_orderId] = _order;
    }

    // Setter for clientOrderById
    function setClientOrderById(uint256 _clientOrderId, ClientOrder memory _clientOrder) external {
        clientOrderById[_clientOrderId] = _clientOrder;
    }



    // State Variables
    uint256 public transactionCount;
    address public admin;
    bool public adminCreated = false;

    // Arrays
    uint256[] public orderIds;
    address[] public distributorAddresses;
    address[] public manufacturerAddresses;
    address[] public supplierAddresses;

    // Counters
    uint256 public orderCounter = 0;
    uint256 public clientOrderCounter = 0;
    uint public orderRawMaterialCounter;
    uint256 public materialIdCounter = 0;

    // Constants
    string constant HIGHER_PRICE = "HIGHER_PRICE";
    string constant FREQUENT_UPDATES = "FREQUENT_UPDATES";
    uint256 constant SIX_MONTHS = 180 days;
    uint256 constant MAX_PRICE_UPDATES = 2;

    // Helper functions for admin
    function setAdmin(address _adminAddress) external {
        admin = _adminAddress;
    }

    function setAdminCreated(bool _adminCreated) external {
        adminCreated = _adminCreated;
    }

    // Helper functions for users
    function addUser(address _userAddress, Role _role, bool _isRegistered) external {
        users[_userAddress] = User({
            userAddress: _userAddress,
            role: _role,
            isRegistered: _isRegistered
        });
    }

    function getUser(address _userAddress) external view returns (User memory) {
        return users[_userAddress];
    }

    // Increment clientOrderCounter
    function incrementClientOrderCounter() external {
        clientOrderCounter++;
    }

    // Helper functions for distributors
    function addDistributor(address _distributorAddress, DistributorDetails memory _details) external {
        distributors[_distributorAddress] = _details;
    }

    function getDistributor(address _distributorAddress) external view returns (DistributorDetails memory) {
        return distributors[_distributorAddress];
    }

    function addDistributorAddress(address _distributorAddress) external {
        distributorAddresses.push(_distributorAddress);
    }

    function getDistributorAddressesCount() external view returns (uint) {
        return distributorAddresses.length;
    }

    function getDistributorAddress(uint index) external view returns (address) {
        return distributorAddresses[index];
    }

    // Helper functions for manufacturers
    function addManufacturer(address _manufacturerAddress, ManufacturerDetails memory _details) external {
        manufacturers[_manufacturerAddress] = _details;
    }

    function getManufacturer(address _manufacturerAddress) external view returns (ManufacturerDetails memory) {
        return manufacturers[_manufacturerAddress];
    }

    function addManufacturerAddress(address _manufacturerAddress) external {
        manufacturerAddresses.push(_manufacturerAddress);
    }

    function getManufacturerAddressesCount() external view returns (uint) {
        return manufacturerAddresses.length;
    }

    function getManufacturerAddress(uint index) external view returns (address) {
        return manufacturerAddresses[index];
    }

    // Helper functions for suppliers
    function addSupplier(address _supplierAddress, SupplierDetails memory _details) external {
        suppliers[_supplierAddress] = _details;
    }

    function getSupplier(address _supplierAddress) external view returns (SupplierDetails memory) {
        return suppliers[_supplierAddress];
    }

    function addSupplierAddress(address _supplierAddress) external {
        supplierAddresses.push(_supplierAddress);
    }

    function getSupplierAddressesCount() external view returns (uint) {
        return supplierAddresses.length;
    }

    function getSupplierAddress(uint index) external view returns (address) {
        return supplierAddresses[index];
    }

    // Helper functions for materials
    function addMaterial(uint256 _materialId, RawMaterial memory _material) external {
        materials[_materialId] = _material;
    }

    function getMaterial(uint256 _materialId) external view returns (RawMaterial memory) {
        require(_materialId > 0 && _materialId <= materialIdCounter, "Invalid material ID");
        return materials[_materialId];
    }

    // Helper functions for supplierToMaterials
    function addSupplierMaterial(address _supplierAddress, uint256 _materialId) external {
        supplierToMaterials[_supplierAddress].push(_materialId);
    }

    function getSupplierMaterials(address _supplierAddress) external view returns (uint256[] memory) {
        return supplierToMaterials[_supplierAddress];
    }

    // Helper functions for manufacturerOrders
    function addManufacturerOrder(address _manufacturerAddress, uint _orderId) external {
        manufacturerOrders[_manufacturerAddress].push(_orderId);
    }

    function getManufacturerOrders(address _manufacturerAddress) external view returns (uint[] memory) {
        return manufacturerOrders[_manufacturerAddress];
    }

    // Helper functions for orders
    function addOrder(uint256 _orderId, Order memory _order) external {
        orders[_orderId] = _order;
    }
    function addOrderId(uint256 _orderId) external {
        orderIds.push(_orderId);
    }

    function getOrder(uint256 _orderId) external view returns (Order memory) {
        return orders[_orderId];
    }

    // Helper functions for clientOrders
    function addClientOrder(uint256 _orderId, ClientOrder memory _clientOrder) external {
        clientOrders[_orderId].push(_clientOrder);
    }

    function getClientOrders(uint256 _orderId) external view returns (ClientOrder[] memory) {
        return clientOrders[_orderId];
    }

    // Helper functions for clientOrderById
    function addClientOrderById(uint256 _clientOrderId, ClientOrder memory _clientOrder) external {
        clientOrderById[_clientOrderId] = _clientOrder;
    }

    function getClientOrderById(uint256 _clientOrderId) external view returns (ClientOrder memory) {
        return clientOrderById[_clientOrderId];
    }

    // Helper functions for rawMaterailOrders
    function addRawMaterialOrder(uint _orderId, OrderRawMaterial memory _order) external {
        rawMaterailOrders[_orderId] = _order;
    }

    function getRawMaterialOrder(uint _orderId) external view returns (OrderRawMaterial memory) {
        return rawMaterailOrders[_orderId];
    }

    // Getter for transactionCount
    function getTransactionCount() external view returns (uint256) {
        return transactionCount;
    }

    // Getter for admin
    function getAdmin() external view returns (address) {
        return admin;
    }

    // Getter for adminCreated
    function getAdminCreated() external view returns (bool) {
        return adminCreated;
    }

    // Getter for orderIds array
    function getOrderIds() external view returns (uint256[] memory) {
        return orderIds;
    }

    // Getter for distributorAddresses array
    function getDistributorAddresses() external view returns (address[] memory) {
        return distributorAddresses;
    }

    // Getter for manufacturerAddresses array
    function getManufacturerAddresses() external view returns (address[] memory) {
        return manufacturerAddresses;
    }

    // Getter for supplierAddresses array
    function getSupplierAddresses() external view returns (address[] memory) {
        return supplierAddresses;
    }

    // Getter for orderCounter
    function getOrderCounter() external view returns (uint256) {
        return orderCounter;
    }

    // Getter for clientOrderCounter
    function getClientOrderCounter() external view returns (uint256) {
        return clientOrderCounter;
    }

    // Getter for orderRawMaterialCounter
    function getOrderRawMaterialCounter() external view returns (uint256) {
        return orderRawMaterialCounter;
    }

    // Getter for materialIdCounter
    function getMaterialIdCounter() external view returns (uint256) {
        return materialIdCounter;
    }
    function setMaterialIdCounter(uint256 _newCounter) external {
        materialIdCounter = _newCounter;
    }

    function setMaterial(uint256 _id, RawMaterial memory _material) external {
        require(_id > 0 && _id <= materialIdCounter, "Invalid material ID");
        materials[_id] = _material;
    }


    // Getter functions for constants
    function getHigherPrice() external pure returns (string memory) {
        return HIGHER_PRICE;
    }

    function getFrequentUpdates() external pure returns (string memory) {
        return FREQUENT_UPDATES;
    }

    function getSixMonths() external pure returns (uint256) {
        return SIX_MONTHS;
    }

    function getMaxPriceUpdates() external pure returns (uint256) {
        return MAX_PRICE_UPDATES;
    }
    
    
    // Events
    event OrderCreated(uint256 indexed id, address indexed manufacturerAddress, address indexed distributorAddress, string productName);
    event ClientOrderAdded(uint256 indexed clientOrderId, uint256 indexed orderId, string clientName);
    event OrderDelivered(uint256 orderId, string clientName, uint256 timestamp);
    event OrderShipped(uint256 orderId, uint256 productHash);
    event MaterialAdded(uint256 indexed id, address indexed supplier);
    event MaterialUpdated(uint256 indexed id);
    event PriceUpdateRequested(uint256 indexed id, uint256 oldPrice, uint256 newPrice, string reason);
    event PriceUpdateApproved(uint256 indexed id, uint256 newPrice);
    event PriceUpdateRejected(uint256 indexed id);
    event RawMaterialOrderCreated(uint orderId, address manufacturer, address supplier);
    event RawMaterialOrderShipped(uint orderId, uint256 shippedAt);
    event RawMaterialOrderDelivered(uint orderId);
    event PriceUpdateConfirmed(uint256 indexed materialId, bool approved);
    event SupplierFraudStatusUpdated(address indexed supplier, bool isFraud, uint256 newReliabilityRating);


    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }

    modifier onlyDistributor() {
        require(users[msg.sender].role == Role.DISTRIBUTOR, "Only distributor can perform this action");
        _;
    }

    modifier onlyManufacturer() {
        require(users[msg.sender].role == Role.MANUFACTURER, "Only manufacturer can perform this action");
        _;
    }

    modifier onlySupplier() {
        require(users[msg.sender].isRegistered && users[msg.sender].role == Role.SUPPLIER, "Only suppliers can perform this action");
        _;
    }
}