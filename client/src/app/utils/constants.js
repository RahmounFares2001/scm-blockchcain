// import { ethers } from "ethers";
// import abi from "./Transactions.json" 


// export const adminAddress = '0x8dE0DDA75de90ae6125d78D17a9E20e3590a7b74';

// export const contractAddress = "0xA38c91e1559c8Ee4B602123658A49e4BeD822a08";

// export const contractABI = abi.abi;




// // create eth contract
// export const createEthereumContract = async () => {
//     try {
//         if (!window.ethereum) throw new Error("Please install MetaMask!");

//         // Request account access
//         const accounts = await window.ethereum.request({ 
//             method: 'eth_requestAccounts' 
//         });
        
//         // Get provider and signer
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner(accounts[0]);
        
//         // Create contract instance with signer
//         const contract = new ethers.Contract(
//             contractAddress,
//             contractABI,
//             signer
//         );

//         console.log("Contract connection established with account:", accounts[0]);
//         return contract;
//     } catch (error) {
//         console.error("Error in createEthereumContract:", error);
//         throw error;
//     }
// };


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
    UserManagement: "0xE309Cb15103819f39Dd111E6557682171095dC68", 
    SupplierManagement: "0xdd7328A55C4e3B204e03C973286Fa63B1D90AA7c",
    SupplierManagement2: "0x03a44AA42df8786536dc77496DE1A580c55173F4",
    OrderManagement: "0xD2f73c59B59a24463C63dC185F68F39b0d3Dd56D", 
    OrderManagement2: "0x6F6b80845738F695819433D2F1e1c374951E7705", 
    Dashboard: "0x4723c1310376B6872357a423741adbbB76796665", 
    DataStructures: "0xCD60DC794C8fB234F79A13A3a8089A8D6326400d", 
};

export const contractABIs = {
    UserManagement: UserManagementABI.abi,
    SupplierManagement: SupplierManagementABI.abi,
    SupplierManagement2: SupplierManagement2ABI.abi,
    OrderManagement: OrderManagementABI.abi,
    OrderManagement: OrderManagement2ABI.abi,
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
