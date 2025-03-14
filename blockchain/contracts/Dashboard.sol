// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract Dashboard {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;

    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    // Admin dashboard
    function getUsersStatistics() public view returns (uint256 supplierCount, uint256 manufacturerCount, uint256 distributorCount) {
        supplierCount = 0;
        manufacturerCount = 0;
        distributorCount = 0;

        // Iterate through all supplier addresses
        address[] memory supplierAddresses = dataStructures.getSupplierAddresses();
        for (uint256 i = 0; i < supplierAddresses.length; i++) {
            if (dataStructures.getUser(supplierAddresses[i]).isRegistered) {
                supplierCount++;
            }
        }

        // Iterate through all manufacturer addresses
        address[] memory manufacturerAddresses = dataStructures.getManufacturerAddresses();
        for (uint256 i = 0; i < manufacturerAddresses.length; i++) {
            if (dataStructures.getUser(manufacturerAddresses[i]).isRegistered) {
                manufacturerCount++;
            }
        }

        // Iterate through all distributor addresses
        address[] memory distributorAddresses = dataStructures.getDistributorAddresses();
        for (uint256 i = 0; i < distributorAddresses.length; i++) {
            if (dataStructures.getUser(distributorAddresses[i]).isRegistered) {
                distributorCount++;
            }
        }
    }

    function getSupplierStatistics() public view returns (uint256 fraudCount, uint256 reliableCount, uint256 underReviewCount) {
        fraudCount = 0;
        reliableCount = 0;
        underReviewCount = 0;

        // Iterate through all supplier addresses
        address[] memory supplierAddresses = dataStructures.getSupplierAddresses();
        for (uint256 i = 0; i < supplierAddresses.length; i++) {
            DataStructures.SupplierDetails memory supplier = dataStructures.getSupplier(supplierAddresses[i]);

            // Skip deleted suppliers
            if (supplier.isDeleted) {
                continue;
            }

            if (keccak256(abi.encodePacked(supplier.isFraud)) == keccak256(abi.encodePacked("Fraud"))) {
                fraudCount++;
            } else if (keccak256(abi.encodePacked(supplier.isFraud)) == keccak256(abi.encodePacked("Reliable"))) {
                reliableCount++;
            } else if (keccak256(abi.encodePacked(supplier.isFraud)) == keccak256(abi.encodePacked("Under Review"))) {
                underReviewCount++;
            }
        }
    }

    function getOrdersStatistics() public view returns (
        uint256 pendingProductionCount,
        uint256 manufacturedCount,
        uint256 shippedToDistributorCount,
        uint256 arrivedToDistributorCount,
        uint256 shippedToClientCount,
        uint256 deliveredToClientCount
    ) {
        pendingProductionCount = 0;
        manufacturedCount = 0;
        shippedToDistributorCount = 0;
        arrivedToDistributorCount = 0;
        shippedToClientCount = 0;
        deliveredToClientCount = 0;

        // Iterate through all order IDs
        uint256[] memory orderIds = dataStructures.getOrderIds();
        for (uint256 i = 0; i < orderIds.length; i++) {
            DataStructures.Order memory order = dataStructures.getOrder(orderIds[i]);

            // Count based on order status
            if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Pending Production"))) {
                pendingProductionCount++;
            } else if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Manufactured"))) {
                manufacturedCount++;
            } else if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Shipped to Distributor"))) {
                shippedToDistributorCount++;
            } else if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Arrived to Distributor"))) {
                arrivedToDistributorCount++;
            }

            // Count client orders for "Shipped to Client" and "Delivered to Client"
            DataStructures.ClientOrder[] memory clientOrdersForOrder = dataStructures.getClientOrders(orderIds[i]);
            for (uint256 j = 0; j < clientOrdersForOrder.length; j++) {
                if (clientOrdersForOrder[j].isShippedToClient) {
                    shippedToClientCount++;
                }
                if (clientOrdersForOrder[j].isArrivedToClient) {
                    deliveredToClientCount++;
                }
            }
        }
    }

    function getMaterialOrderStatistics() public view returns (
        uint256 pendingCount,
        uint256 manufacturedCount,
        uint256 shippedToDistributorCount,
        uint256 arrivedToDistributorCount,
        uint256 canceledCount
    ) {
        pendingCount = 0;
        manufacturedCount = 0;
        shippedToDistributorCount = 0;
        arrivedToDistributorCount = 0;
        canceledCount = 0;

        // Iterate through all orders
        uint256 orderCounter = dataStructures.getOrderCounter();
        for (uint256 i = 1; i <= orderCounter; i++) {
            DataStructures.Order memory order = dataStructures.getOrder(i);

            // Count based on order status
            if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Pending Production"))) {
                pendingCount++;
            } else if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Manufactured"))) {
                manufacturedCount++;
            } else if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Shipped to Distributor"))) {
                shippedToDistributorCount++;
            } else if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Arrived to Distributor"))) {
                arrivedToDistributorCount++;
            } else if (keccak256(abi.encodePacked(order.orderStatus)) == keccak256(abi.encodePacked("Canceled"))) {
                canceledCount++;
            }
        }
    }
}