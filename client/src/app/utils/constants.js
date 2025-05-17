
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
  "UserManagement": "0xb2f8568Cdad8beb3a4a092D5852edDAba479F9a4",
  "SupplierManagement": "0x7CDcb3889D631ed1F986A32Df92485d7D586f697",
  "SupplierManagement2": "0x2F651B47529cD167906f99288F3B1f8385CEa265",
  "OrderManagement": "0xBcb313f253CC7D2D4aCF54E33D079dbBDDA45c98",
  "OrderManagement2": "0x46E60A98722921B7ac65d7A53769539B266e3522",
  "Dashboard": "0x3Fd9f38a4805193E7874c62092e56e69Bfd4C184",
  "DataStructures": "0x8F29344f3AeA56FE4bD094231bC0861599a1F81f"
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

// client contract
const adminPrivateKey = "2defdd7833f34dbeb1eaaa41070833730b86b77decb7e76e5f3c166c8cb47968";
const rpcUrl = "http://127.0.0.1:7545";
export const createClientEthereumContract = async (contractName) => {
    try {
      // Use Ganache local RPC provider
      const provider = new ethers.JsonRpcProvider(rpcUrl);
  
      // Create a wallet with the admin private key
      const wallet = new ethers.Wallet(adminPrivateKey, provider);
      const signer = wallet;
  
      const contract = new ethers.Contract(
        contractAddresses[contractName],
        contractABIs[contractName],
        signer
      );
  
      return contract;
    } catch (error) {
      console.error("Error in createEthereumContract:", error);
      throw error;
    }
};
