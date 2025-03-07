// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract OrderManagement is DataStructures {
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

    // raw material orders
    function createOrderRawMaterial(OrderRawMaterialParams memory params) external {
        // // Fetch supplier
        // SupplierDetails memory supplier = userManagement.getSupplierByAddress(params.supplierAddress);
        // require(params.supplierAddress != address(0), "Supplier does not exist");

        // // Fetch manufacturer
        // ManufacturerDetails memory manufacturer = userManagement.getManufacturerByAddress(params.manufacturerAddress);
        // require(params.manufacturerAddress != address(0), "Manufacturer does not exist");

        orderRawMaterialCounter++;
        rawMaterailOrders[orderRawMaterialCounter] = OrderRawMaterial({
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
        });
        manufacturerOrders[params.manufacturerAddress].push(orderRawMaterialCounter);
        emit RawMaterialOrderCreated(orderRawMaterialCounter, params.manufacturerAddress, params.supplierAddress);
    }

    function shipRawMaterial(uint orderId) external {
        require(keccak256(bytes(rawMaterailOrders[orderId].status)) == keccak256(bytes("Pending")), "Already shipped");
        rawMaterailOrders[orderId].status = "Shipped";
        rawMaterailOrders[orderId].shippedAt = block.timestamp;
        emit RawMaterialOrderShipped(orderId, block.timestamp);
    }

    function confirmRawMaterialReception(uint orderId) external {
        require(keccak256(bytes(rawMaterailOrders[orderId].status)) == keccak256(bytes("Shipped")), "Not yet shipped");
        require(keccak256(bytes(rawMaterailOrders[orderId].status)) != keccak256(bytes("Delivered")), "Already delivered");
        rawMaterailOrders[orderId].status = "Delivered";
        rawMaterailOrders[orderId].quantityreceived = rawMaterailOrders[orderId].quantityOrdered;
        rawMaterailOrders[orderId].arrivedAt = block.timestamp;
        emit RawMaterialOrderDelivered(orderId);
    }

    // product orders
    function createOrder(OrderParams memory params) external onlyAdmin {
        // // Fetch manufacturer
        // ManufacturerDetails memory manufacturer = userManagement.getManufacturerByAddress(params.manufacturerAddress);
        // require(params.manufacturerAddress != address(0), "Manufacturer does not exist");

        // // Fetch distributor
        // DistributorDetails memory distributor = userManagement.getDistributorByAddress(params.distributorAddress);
        // require(params.distributorAddress != address(0), "Distributor does not exist");

        orderCounter++;

        orders[orderCounter] = Order({
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
        });

        orderIds.push(orderCounter);
        emit OrderCreated(orderCounter, params.manufacturerAddress, params.distributorAddress, params.productName);
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

    function getOrderByManufacturerAddress(address _manufacturerAddress) external view returns (Order[] memory) {
        uint256 count = 0;
        
        // Count number of orders
        for(uint256 i = 0; i < orderCounter; i++) {
            if(orders[i + 1].manufacturerAddress == _manufacturerAddress) {
                count++;
            }
        }

        // Result table
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


}