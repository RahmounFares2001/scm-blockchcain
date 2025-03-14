// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract OrderManagement {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;

    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    // Struct to group raw material order parameters
    struct OrderRawMaterialParams {
        address supplierAddress;
        address manufacturerAddress;
        string materialName;
        string materialId;
        uint256 quantityOrdered;
        uint256 price;
        uint256 shouldArriveAt;
    }

    // Struct to group product order parameters
    struct OrderParams {
        address manufacturerAddress;
        address distributorAddress;
        string productName;
        uint256 productQuantity;
    }

    // Struct to group client order parameters
    struct ClientOrderParams {
        uint256 orderId;
        string clientName;
        string clientAddress;
        uint256 clientProductQuantity;
        uint256 shouldArriveToClientAt;
    }

    // Modifier to restrict access to admin
    modifier onlyAdmin() {
        require(dataStructures.getUser(msg.sender).role == DataStructures.Role.ADMIN, "Not authorized");
        _;
    }

    // raw material orders
    event RawMaterialOrderCreated(uint orderId, address manufacturer, address supplier);
    event RawMaterialOrderShipped(uint orderId, uint256 shippedAt);
    event RawMaterialOrderDelivered(uint orderId);
    event OrderCreated(uint256 indexed id, address indexed manufacturerAddress, address indexed distributorAddress, string productName);


    // raw material orders
    function createOrderRawMaterial(OrderRawMaterialParams memory params) external {
        uint256 orderRawMaterialCounter = dataStructures.getOrderRawMaterialCounter();
        orderRawMaterialCounter++;

        dataStructures.addRawMaterialOrder(orderRawMaterialCounter, DataStructures.OrderRawMaterial({
            id: orderRawMaterialCounter,
            supplierAddress: params.supplierAddress,
            manufacturerAddress: params.manufacturerAddress,
            materialName: params.materialName,
            materialId: params.materialId,
            quantityOrdered: params.quantityOrdered,
            quantityreceived: 0,
            price: params.price,
            shippedAt: 0,
            shouldArriveAt: params.shouldArriveAt,
            arrivedAt: 0,
            status: "Pending"
        }));

        dataStructures.addManufacturerOrder(params.manufacturerAddress, orderRawMaterialCounter);
        emit RawMaterialOrderCreated(orderRawMaterialCounter, params.manufacturerAddress, params.supplierAddress);
    }

    function shipRawMaterial(uint orderId) external {
        // Read the order from storage
        DataStructures.OrderRawMaterial memory order = dataStructures.getRawMaterialOrder(orderId);

        // Ensure the order is in the "Pending" state
        require(keccak256(bytes(order.status)) == keccak256(bytes("Pending")), "Already shipped");

        // Update the order status and shipment timestamp
        order.status = "Shipped";
        order.shippedAt = block.timestamp;

        // Save the updated order back to storage
        dataStructures.updateRawMaterialOrder(orderId, order);

        // Emit the event
        emit RawMaterialOrderShipped(orderId, block.timestamp);
    }

    function confirmRawMaterialReception(uint orderId) external {
        // Read the order from storage
        DataStructures.OrderRawMaterial memory order = dataStructures.getRawMaterialOrder(orderId);

        // Ensure the order is in the "Shipped" state and not already delivered
        require(keccak256(bytes(order.status)) == keccak256(bytes("Shipped")), "Not yet shipped");
        require(keccak256(bytes(order.status)) != keccak256(bytes("Delivered")), "Already delivered");

        // Update the order status, received quantity, and arrival timestamp
        order.status = "Delivered";
        order.quantityreceived = order.quantityOrdered;
        order.arrivedAt = block.timestamp;

        // Save the updated order back to storage
        dataStructures.updateRawMaterialOrder(orderId, order);

        // Emit the event
        emit RawMaterialOrderDelivered(orderId);
    }

    // product orders
    function createOrder(OrderParams memory params) external onlyAdmin {
        uint256 orderCounter = dataStructures.getOrderCounter();
        orderCounter++;

        dataStructures.addOrder(orderCounter, DataStructures.Order({
            id: orderCounter,
            manufacturerAddress: params.manufacturerAddress,
            isProduced: false,
            producedAt: 0,
            isShippedToDistributor: false,
            shippedToDistributorAt: 0,
            distributorAddress: params.distributorAddress,
            isArrivedToDistributor: false,
            arrivedToDistributorAt: 0,
            productName: params.productName,
            productQuantity: params.productQuantity,
            productHash: 0,
            orderStatus: "Pending Production"
        }));

        dataStructures.addOrderId(orderCounter);
        emit OrderCreated(orderCounter, params.manufacturerAddress, params.distributorAddress, params.productName);
    }

    function getAllOrders() external view returns (DataStructures.Order[] memory) {
        uint256 orderCounter = dataStructures.getOrderCounter();
        DataStructures.Order[] memory allOrders = new DataStructures.Order[](orderCounter);

        for (uint256 i = 0; i < orderCounter; i++) {
            allOrders[i] = dataStructures.getOrder(i + 1); // IDs start with 1
        }

        return allOrders;
    }

    function getOrderByOrderId(uint256 _orderId) public view returns (DataStructures.Order memory) {
        require(_orderId > 0 && _orderId <= dataStructures.getOrderCounter(), "Invalid Order ID");
        return dataStructures.getOrder(_orderId);
    }

    function getOrderByManufacturerAddress(address _manufacturerAddress) external view returns (DataStructures.Order[] memory) {
        uint256 orderCounter = dataStructures.getOrderCounter();
        uint256 count = 0;

        // Count number of orders
        for (uint256 i = 0; i < orderCounter; i++) {
            if (dataStructures.getOrder(i + 1).manufacturerAddress == _manufacturerAddress) {
                count++;
            }
        }

        // Result table
        DataStructures.Order[] memory _orders = new DataStructures.Order[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < orderCounter; i++) {
            uint256 orderId = i + 1;
            if (dataStructures.getOrder(orderId).manufacturerAddress == _manufacturerAddress) {
                _orders[index] = dataStructures.getOrder(orderId);
                index++;
            }
        }

        return _orders;
    }

    function getAllMaterialsOrders() public view returns (DataStructures.OrderRawMaterial[] memory) {
        uint256 orderRawMaterialCounter = dataStructures.getOrderRawMaterialCounter();
        DataStructures.OrderRawMaterial[] memory orders = new DataStructures.OrderRawMaterial[](orderRawMaterialCounter);

        for (uint256 i = 1; i <= orderRawMaterialCounter; i++) {
            orders[i - 1] = dataStructures.getRawMaterialOrder(i);
        }

        return orders;
    }
}