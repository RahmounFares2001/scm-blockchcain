
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
  "UserManagement": "0xaaC1a2c2ab720464Ec37Fd37140db443079eF05D",
  "SupplierManagement": "0x9a9b497bD5aB214c9d15b6324e1dD52cCD733Ec1",
  "SupplierManagement2": "0x7446e283Be96e30Abb39Cb6148a4f5185d9421F6",
  "OrderManagement": "0xbD3B58C5512DA8a5F18D97f4Ab4d1D42db14fE8e",
  "OrderManagement2": "0xaaBf1355adeA3EDec2Dea16244A6A92BF2c36819",
  "Dashboard": "0x34F73Be06de0f5E30A251586790b47564CcE05a6",
  "DataStructures": "0x229c9796D28DAce8378Dc63529cE832Dde2C3051"
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
