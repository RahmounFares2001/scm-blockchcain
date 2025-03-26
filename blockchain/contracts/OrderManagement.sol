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
    function createOrderRawMaterial(
        address supplierAddress,
        address manufacturerAddress,
        string memory materialName,
        string memory materialId,
        uint256 quantityOrdered,
        uint256 price,
        uint256 shouldArriveAt
    ) external {
        // Récupérer la matière première correspondante
        uint256 materialIdInt = stringToUint(materialId); // Convertir materialId en uint256
        DataStructures.RawMaterial memory material = dataStructures.getMaterial(materialIdInt);

        // Réduire la quantité disponible
        material.quantityAvailable -= quantityOrdered;

        // Mettre à jour la matière première dans le stockage
        dataStructures.setMaterial(materialIdInt, material);
        
        // Incrémenter le compteur de commandes
        uint256 orderRawMaterialCounter = dataStructures.getOrderRawMaterialCounter();
        orderRawMaterialCounter++;
        dataStructures.setOrderRawMaterialCounter(orderRawMaterialCounter);


        // Ajouter la commande de matière première
        dataStructures.addRawMaterialOrder(orderRawMaterialCounter, DataStructures.OrderRawMaterial({
            id: orderRawMaterialCounter,
            supplierAddress: supplierAddress,
            manufacturerAddress: manufacturerAddress,
            materialName: materialName,
            materialId: materialId,
            quantityOrdered: quantityOrdered,
            quantityreceived: 0,
            price: price,
            shippedAt: 0,
            shouldArriveAt: shouldArriveAt,
            arrivedAt: 0,
            status: "Pending"
        }));

        // Ajouter la commande au fabricant
        dataStructures.addManufacturerOrder(manufacturerAddress, orderRawMaterialCounter);

        // Émettre un événement
        emit RawMaterialOrderCreated(orderRawMaterialCounter, manufacturerAddress, supplierAddress);
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
    function createOrder(
        address manufacturerAddress,
        address distributorAddress,
        string memory productName,
        uint256 productQuantity
    ) external onlyAdmin {
        // Incrémenter le compteur de commandes
        uint256 orderCounter = dataStructures.getOrderCounter();
        orderCounter++;
        dataStructures.setOrderCounter(orderCounter);

        // Ajouter la commande
        dataStructures.addOrder(orderCounter, DataStructures.Order({
            id: orderCounter,
            manufacturerAddress: manufacturerAddress,
            isProduced: false,
            producedAt: 0,
            isShippedToDistributor: false,
            shippedToDistributorAt: 0,
            distributorAddress: distributorAddress,
            isArrivedToDistributor: false,
            arrivedToDistributorAt: 0,
            productName: productName,
            productQuantity: productQuantity,
            productHash: 0,
            orderStatus: "Pending Production"
        }));

        // Ajouter l'ID de la commande
        dataStructures.addOrderId(orderCounter);

        // Émettre un événement
        emit OrderCreated(orderCounter, manufacturerAddress, distributorAddress, productName);
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

    function getAllManufacturerOrders() external view returns (DataStructures.Order[] memory) {
        uint256 orderCounter = dataStructures.getOrderCounter();
        uint256 count = 0;

        for (uint256 i = 0; i < orderCounter; i++) {
            if (dataStructures.getOrder(i + 1).manufacturerAddress == msg.sender) {
                count++;
            }
        }

        DataStructures.Order[] memory manufacturerOrders = new DataStructures.Order[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < orderCounter; i++) {
            uint256 orderId = i + 1;
            if (dataStructures.getOrder(orderId).manufacturerAddress == msg.sender) {
                manufacturerOrders[index] = dataStructures.getOrder(orderId);
                index++;
            }
        }

        return manufacturerOrders;
    }

    function getAllDistributorOrders() external view returns (DataStructures.Order[] memory) {
        uint256 orderCounter = dataStructures.getOrderCounter();
        uint256 count = 0;

        for (uint256 i = 0; i < orderCounter; i++) {
            if (dataStructures.getOrder(i + 1).distributorAddress == msg.sender) {
                count++;
            }
        }

        DataStructures.Order[] memory distributorOrders = new DataStructures.Order[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < orderCounter; i++) {
            uint256 orderId = i + 1;
            if (dataStructures.getOrder(orderId).distributorAddress == msg.sender) {
                distributorOrders[index] = dataStructures.getOrder(orderId);
                index++;
            }
        }

        return distributorOrders;
    }

    function getAllMaterialsOrders() public view returns (DataStructures.OrderRawMaterial[] memory) {
        uint256 orderRawMaterialCounter = dataStructures.getOrderRawMaterialCounter();
        DataStructures.OrderRawMaterial[] memory orders = new DataStructures.OrderRawMaterial[](orderRawMaterialCounter);

        for (uint256 i = 1; i <= orderRawMaterialCounter; i++) {
            orders[i - 1] = dataStructures.getRawMaterialOrder(i);
        }

        return orders;
    }

    function getAllSupplierMaterialOrders() external view returns (DataStructures.OrderRawMaterial[] memory) {
        // Get the total number of raw material orders
        uint256 orderRawMaterialCounter = dataStructures.getOrderRawMaterialCounter();
        uint256 count = 0;

        for (uint256 i = 1; i <= orderRawMaterialCounter; i++) {
            if (dataStructures.getRawMaterialOrder(i).supplierAddress == msg.sender) {
                count++;
            }
        }

        // array to store the supplier's raw material orders
        DataStructures.OrderRawMaterial[] memory supplierOrders = new DataStructures.OrderRawMaterial[](count);
        uint256 index = 0;

        // populate the array with the supplier's orders
        for (uint256 i = 1; i <= orderRawMaterialCounter; i++) {
            DataStructures.OrderRawMaterial memory order = dataStructures.getRawMaterialOrder(i);
            if (order.supplierAddress == msg.sender) {
                supplierOrders[index] = order;
                index++;
            }
        }

        return supplierOrders;
    }

    function getManufacturerMaterialOrders() external view returns (DataStructures.OrderRawMaterial[] memory) {
        // Get the total number of raw material orders
        uint256 orderRawMaterialCounter = dataStructures.getOrderRawMaterialCounter();
        uint256 count = 0;

        for (uint256 i = 1; i <= orderRawMaterialCounter; i++) {
            if (dataStructures.getRawMaterialOrder(i).manufacturerAddress == msg.sender) {
                count++;
            }
        }

        DataStructures.OrderRawMaterial[] memory manufacturerOrders = new DataStructures.OrderRawMaterial[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= orderRawMaterialCounter; i++) {
            DataStructures.OrderRawMaterial memory order = dataStructures.getRawMaterialOrder(i);
            if (order.manufacturerAddress == msg.sender) {
                manufacturerOrders[index] = order;
                index++;
            }
        }

        return manufacturerOrders;
    }

    // helper functions
    function stringToUint(string memory s) internal pure returns (uint256) {
        bytes memory b = bytes(s);
        uint256 result = 0;
        for (uint256 i = 0; i < b.length; i++) {
            uint256 c = uint256(uint8(b[i]));
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            } else {
                revert("Invalid character in string");
            }
        }
        return result;
    }
}