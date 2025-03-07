// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract OrderManagement2 is DataStructures {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;


    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    // Struct to group client order parameters
    struct ClientOrderParams {
        uint256 orderId;
        string clientName;
        string clientAddress;
        uint256 clientProductQuantity;
        uint256 shouldArriveToClientAt;
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
        require(!orders[_orderId].isProduced, "Order already produced");

        // Update order status
        orders[_orderId].orderStatus = "Manufactured";

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
        orders[_orderId].productHash = helperFunctions.createProductHash(
            orders[_orderId].productQuantity,
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

        // Update order status
        orders[_orderId].orderStatus = "Arrived to Distributor";

        orders[_orderId].isArrivedToDistributor = true;
        orders[_orderId].arrivedToDistributorAt = block.timestamp;
    }

    // client order
    function addClientOrder(ClientOrderParams memory params) external onlyDistributor {
        require(params.orderId > 0 && params.orderId <= orderCounter, "Invalid Order ID");
        Order storage order = orders[params.orderId];

        require(order.isArrivedToDistributor, "Order not yet at distributor");
        require(params.clientProductQuantity <= order.productQuantity, "Not enough stock available");

        // Reduce Order.productQuantity
        order.productQuantity -= params.clientProductQuantity;

        clientOrderCounter++;
        ClientOrder memory newClientOrder = ClientOrder({
            id: clientOrderCounter,
            orderId: params.orderId,
            clientName: params.clientName,
            clientAddress: params.clientAddress,
            clientProductQuantity: params.clientProductQuantity,
            shouldArriveToClientAt: params.shouldArriveToClientAt,
            isShippedToClient: false,
            shippedToClientAt: 0,
            isArrivedToClient: false,
            deliveredToClientAt: 0
        });

        clientOrders[params.orderId].push(newClientOrder);
        clientOrderById[clientOrderCounter] = newClientOrder;

        emit ClientOrderAdded(clientOrderCounter, params.orderId, params.clientName);
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
}