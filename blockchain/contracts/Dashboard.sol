// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./DataStructures.sol";
import "./HelperFunctions.sol";
import "./UserManagement.sol";

contract Dashboard is DataStructures {
    HelperFunctions public helperFunctions;
    UserManagement public userManagement;
    DataStructures public dataStructures;


    constructor(address _dataStructuresAddress) {
        dataStructures = DataStructures(_dataStructuresAddress);
    }

    // admin dashboard
    function getUsersStatistics() public view returns (uint256 supplierCount, uint256 manufacturerCount, uint256 distributorCount) {
            supplierCount = 0;
            manufacturerCount = 0;
            distributorCount = 0;

            for (uint256 i = 0; i < address(this).balance; i++) {
                address userAddress = address(uint160(i));
                if (users[userAddress].isRegistered) {
                    if (users[userAddress].role == Role.SUPPLIER) {
                        supplierCount++;
                    } else if (users[userAddress].role == Role.MANUFACTURER) {
                        manufacturerCount++;
                    } else if (users[userAddress].role == Role.DISTRIBUTOR) {
                        distributorCount++;
                    }
                }
            }
        }

        function getSupplierStatistics() public view returns (uint256 fraudCount, uint256 reliableCount, uint256 underReviewCount) {
            fraudCount = 0;
            reliableCount = 0;
            underReviewCount = 0;

            for (uint256 i = 0; i < supplierAddresses.length; i++) {
                address supplierAddress = supplierAddresses[i];
                SupplierDetails storage supplier = suppliers[supplierAddress];

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
            for (uint256 i = 0; i < orderIds.length; i++) {
                uint256 orderId = orderIds[i];
                Order storage order = orders[orderId];

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
                ClientOrder[] storage clientOrdersForOrder = clientOrders[orderId];
                for (uint256 j = 0; j < clientOrdersForOrder.length; j++) {
                    ClientOrder storage clientOrder = clientOrdersForOrder[j];
                    if (clientOrder.isShippedToClient) {
                        shippedToClientCount++;
                    }
                    if (clientOrder.isArrivedToClient) {
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
            for (uint256 i = 1; i <= orderCounter; i++) {
                Order storage order = orders[i];

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