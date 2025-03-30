// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract OrderManagement2 {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;

    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    // Modifier to restrict access to manufacturers
    modifier onlyManufacturer() {
        require(dataStructures.getUser(msg.sender).role == DataStructures.Role.MANUFACTURER, "Only manufacturers can perform this action");
        _;
    }

    // Modifier to restrict access to distributors
    modifier onlyDistributor() {
        require(dataStructures.getUser(msg.sender).role == DataStructures.Role.DISTRIBUTOR, "Only distributors can perform this action");
        _;
    }

    function getOrdersByDistributorAddress(address _distributorAddress) public view returns (DataStructures.Order[] memory) {
        uint256 orderCounter = dataStructures.getOrderCounter();
        uint256 count = 0;

        // Count orders for the given distributor
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (dataStructures.getOrder(i).distributorAddress == _distributorAddress) {
                count++;
            }
        }

        // Result table
        DataStructures.Order[] memory _orders = new DataStructures.Order[](count);
        uint256 index = 0;

        // Store orders for the given distributor
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (dataStructures.getOrder(i).distributorAddress == _distributorAddress) {
                _orders[index] = dataStructures.getOrder(i);
                index++;
            }
        }

        return _orders;
    }

    function produceProduct(uint256 _orderId) external onlyManufacturer {
        // Fetch the order from storage
        DataStructures.Order memory order = dataStructures.getOrder(_orderId);

        require(order.manufacturerAddress == msg.sender, "Unauthorized: Not your order");
        require(!order.isProduced, "Order already produced");

        // Update order status
        order.orderStatus = "Manufactured";
        order.isProduced = true;
        order.producedAt = block.timestamp;

        // Save the updated order back to storage
        dataStructures.setOrder(_orderId, order);
    }

    
    event OrderShipped(uint256 orderId, uint256 productHash);

    function shipProductToDistributor(uint256 _orderId) external onlyManufacturer {
        // Fetch the order from storage
        DataStructures.Order memory order = dataStructures.getOrder(_orderId);

        require(order.manufacturerAddress == msg.sender, "Not authorized");
        require(order.isProduced, "Order not produced yet");
        require(!order.isShippedToDistributor, "Already shipped");

        order.isShippedToDistributor = true;
        order.shippedToDistributorAt = block.timestamp;

        // Generate product hash
        order.productHash = createProductHash(
            order.productQuantity,
            order.producedAt,
            order.shippedToDistributorAt
        );

        // Update order status
        order.orderStatus = "Shipped to Distributor";

        // Save the updated order back to storage
        dataStructures.setOrder(_orderId, order);

        emit OrderShipped(_orderId, order.productHash);
    }

    function confirmArrivalToDistributor(uint256 _orderId) external onlyDistributor {
        // Fetch the order from storage
        DataStructures.Order memory order = dataStructures.getOrder(_orderId);

        require(order.distributorAddress == msg.sender, "Not authorized");
        require(!order.isArrivedToDistributor, "Already confirmed");

        // Update order status
        order.orderStatus = "Arrived to Distributor";
        order.isArrivedToDistributor = true;
        order.arrivedToDistributorAt = block.timestamp;

        // Save the updated order back to storage
        dataStructures.setOrder(_orderId, order);
    }


    // client order
    event ClientOrderAdded(uint256 indexed clientOrderId, uint256 indexed orderId, string clientName);


    function addClientOrder(
        uint256 orderId,
        string memory clientName,
        string memory clientAddress,
        uint256 clientProductQuantity,
        uint256 shouldArriveToClientAt
    ) external onlyDistributor {
        // Récupérer la commande depuis le stockage
        DataStructures.Order memory order = dataStructures.getOrder(orderId);

        // Vérifier que la commande est arrivée chez le distributeur
        require(order.isArrivedToDistributor, "Order not yet at distributor");

        order.productQuantity -= clientProductQuantity;

        // Sauvegarder la commande mise à jour dans le stockage
        dataStructures.setOrder(orderId, order);

        // Incrémenter le compteur de commandes clients
        uint256 clientOrderCounter = dataStructures.getClientOrderCounter();
        clientOrderCounter++;
        dataStructures.incrementClientOrderCounter();

        // Créer une nouvelle commande client
        DataStructures.ClientOrder memory newClientOrder = DataStructures.ClientOrder({
            id: clientOrderCounter,
            orderId: orderId,
            clientName: clientName,
            clientAddress: clientAddress,
            clientProductQuantity: clientProductQuantity,
            shouldArriveToClientAt: shouldArriveToClientAt,
            isShippedToClient: false,
            shippedToClientAt: 0,
            isArrivedToClient: false,
            deliveredToClientAt: 0
        });

        // Ajouter la nouvelle commande client au stockage
        dataStructures.addClientOrder(orderId, newClientOrder);
        dataStructures.setClientOrderById(clientOrderCounter, newClientOrder);

        // Émettre l'événement
        emit ClientOrderAdded(clientOrderCounter, orderId, clientName);
    }

    // ship client order
    event OrderDelivered(uint256 orderId, string clientName, uint256 timestamp);

    function shipClientOrder(uint256 _clientOrderId) external onlyDistributor {

        // Fetch client order from DataStructures
        DataStructures.ClientOrder memory clientOrder = dataStructures.getClientOrderById(_clientOrderId);

        // Verify distributor ownership
        DataStructures.Order memory order = dataStructures.getOrder(clientOrder.orderId);
        require(order.id != 0, "Parent order does not exist");

        // Check if already shipped
        require(clientOrder.shippedToClientAt == 0, "Already shipped");

        // Update the client order in memory
        clientOrder.isShippedToClient = true;
        clientOrder.shippedToClientAt = block.timestamp;

        // Pass the updated client order to DataStructures setter
        dataStructures.updateClientOrder(_clientOrderId, clientOrder);
    }

    function clientConfirmDelivery(uint256 _clientOrderId) public {
        DataStructures.ClientOrder memory clientOrder = dataStructures.getClientOrderById(_clientOrderId);

        // Validation
        require(_clientOrderId > 0 && _clientOrderId <= dataStructures.getClientOrderCounter(), "Invalid Client Order ID");
        require(!clientOrder.isArrivedToClient, "Already delivered");

        // Update the client order in memory
        clientOrder.isArrivedToClient = true;
        clientOrder.deliveredToClientAt = block.timestamp;

        // Pass the updated client order to DataStructures setter
        dataStructures.updateClientOrder(_clientOrderId, clientOrder);

        emit OrderDelivered(clientOrder.orderId, clientOrder.clientName, block.timestamp);
    }


    function getAllClientOrders() public view returns (DataStructures.ClientOrderWithOrder[] memory) {
        uint256 orderCounter = dataStructures.getOrderCounter();
        uint256 totalClientOrders = 0;

        // Count all client orders
        for (uint256 i = 1; i <= orderCounter; i++) {
            totalClientOrders += dataStructures.getClientOrders(i).length;
        }

        DataStructures.ClientOrderWithOrder[] memory allClientOrders = new DataStructures.ClientOrderWithOrder[](totalClientOrders);
        uint256 index = 0;

        for (uint256 i = 1; i <= orderCounter; i++) {
            DataStructures.ClientOrder[] memory clientOrdersForOrder = dataStructures.getClientOrders(i);
            for (uint256 j = 0; j < clientOrdersForOrder.length; j++) {
                allClientOrders[index] = DataStructures.ClientOrderWithOrder({
                    clientOrder: clientOrdersForOrder[j],
                    order: dataStructures.getOrder(i)
                });
                index++;
            }
        }

        return allClientOrders;
    }

    function getDistributorClientOrders() public view onlyDistributor returns (DataStructures.ClientOrderWithOrder[] memory) {
        address distributorAddress = msg.sender; 
        uint256 orderCounter = dataStructures.getOrderCounter();
        uint256 totalClientOrders = 0;

        // Count client orders for the distributor
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (dataStructures.getOrder(i).distributorAddress == distributorAddress) {
                totalClientOrders += dataStructures.getClientOrders(i).length;
            }
        }

        // Create result array
        DataStructures.ClientOrderWithOrder[] memory distributorClientOrders = new DataStructures.ClientOrderWithOrder[](totalClientOrders);
        uint256 index = 0;

        // Populate client orders for the distributor
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (dataStructures.getOrder(i).distributorAddress == distributorAddress) {
                DataStructures.ClientOrder[] memory clientOrdersForOrder = dataStructures.getClientOrders(i);
                for (uint256 j = 0; j < clientOrdersForOrder.length; j++) {
                    distributorClientOrders[index] = DataStructures.ClientOrderWithOrder({
                        clientOrder: clientOrdersForOrder[j],
                        order: dataStructures.getOrder(i)
                    });
                    index++;
                }
            }
        }

        return distributorClientOrders;
    }

    function getOrderDetailsByClientOrderId(uint256 _clientOrderId) public view returns (DataStructures.Order memory, DataStructures.ClientOrder memory) {
        require(_clientOrderId > 0 && _clientOrderId <= dataStructures.getClientOrderCounter(), "Invalid Client Order ID");
        DataStructures.ClientOrder memory clientOrder = dataStructures.getClientOrderById(_clientOrderId);
        DataStructures.Order memory order = dataStructures.getOrder(clientOrder.orderId);
        return (order, clientOrder);
    }

    function getClientOrderByDistributorAddress(address _distributorAddress) public view returns (DataStructures.ClientOrderWithOrder[] memory) {
        uint256 orderCounter = dataStructures.getOrderCounter();
        uint256 totalClientOrders = 0;

        // Count client orders for the given distributor
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (dataStructures.getOrder(i).distributorAddress == _distributorAddress) {
                totalClientOrders += dataStructures.getClientOrders(i).length;
            }
        }

        DataStructures.ClientOrderWithOrder[] memory distributorClientOrders = new DataStructures.ClientOrderWithOrder[](totalClientOrders);
        uint256 index = 0;

        // Store client orders for the given distributor
        for (uint256 i = 1; i <= orderCounter; i++) {
            if (dataStructures.getOrder(i).distributorAddress == _distributorAddress) {
                DataStructures.ClientOrder[] memory clientOrdersForOrder = dataStructures.getClientOrders(i);
                for (uint256 j = 0; j < clientOrdersForOrder.length; j++) {
                    distributorClientOrders[index] = DataStructures.ClientOrderWithOrder({
                        clientOrder: clientOrdersForOrder[j],
                        order: dataStructures.getOrder(i)
                    });
                    index++;
                }
            }
        }

        return distributorClientOrders;
    }
    // create hash from order details
    function createProductHash(uint256 quantity, uint256 producedAt, uint256 shippedAt) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(quantity, producedAt, shippedAt)));
    }
}