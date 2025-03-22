
import { ethers } from "ethers";
import UserManagementABI from "./UserManagement.json";
import SupplierManagementABI from "./SupplierManagement.json";
import SupplierManagement2ABI from "./SupplierManagement2.json";
import OrderManagementABI from "./OrderManagement.json";
import OrderManagement2ABI from "./OrderManagement2.json";
import DashboardABI from "./Dashboard.json";
import DataStructuresABI from "./DataStructures.json";

export const adminAddress = '0x8dE0DDA75de90ae6125d78D17a9E20e3590a7b74';

export const contractAddresses = {
  "UserManagement": "0xB46abBa5402d890eCB3A427534473DC74DCFFdC7",
  "SupplierManagement": "0x622c4426DB4Fc462B1Fe4Dc76d29223280FA68c9",
  "SupplierManagement2": "0xFD0d3C78C6BD22DaeB3209832Fe29b28362B73D0",
  "OrderManagement": "0xB901707eAa382E60891b647779827EB5832D3aE3",
  "OrderManagement2": "0xb35444338d1FCB255A6D3112c0d52d17E01De143",
  "Dashboard": "0xf704e45BA716aD99100183C216A0B9e74D529a0c",
  "DataStructures": "0xBaA7f47f3D2654c0d5159dD24b688edb114A5100"
};

export const contractABIs = {
  UserManagement: UserManagementABI.abi,
  SupplierManagement: SupplierManagementABI.abi,
  SupplierManagement2: SupplierManagement2ABI.abi,
  OrderManagement: OrderManagementABI.abi,
  OrderManagement2: OrderManagement2ABI.abi,
  Dashboard: DashboardABI.abi,
  DataStructures: DataStructuresABI.abi,
};

// Create Ethereum contract instance
export const createEthereumContract = async (contractName) => {
    try {
        if (!window.ethereum) throw new Error("Please install MetaMask!");

        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(accounts[0]);

        const contract = new ethers.Contract(
            contractAddresses[contractName],
            contractABIs[contractName],
            signer
        );

        console.log(`Contract ${contractName} connected with account:`, accounts[0]);
        return contract;
    } catch (error) {
        console.error("Error in createEthereumContract:", error);
        throw error;
    }
};
