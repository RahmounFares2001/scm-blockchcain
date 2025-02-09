import { ethers } from "ethers";
import abi from "./Transactions.json" 


export const adminAddress = '0x8dE0DDA75de90ae6125d78D17a9E20e3590a7b74';

export const contractAddress = "0xA38c91e1559c8Ee4B602123658A49e4BeD822a08";

export const contractABI = abi.abi;

// contract.deploy({
//     data: bytecode,
//     arguments: [adminAddress]
// }).send({
//     from: adminAddress
// });


// create eth contract
export const createEthereumContract = async () => {
    try {
        if (!window.ethereum) throw new Error("Please install MetaMask!");

        // Request account access
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        // Get provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner(accounts[0]);
        
        // Create contract instance with signer
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );

        console.log("Contract connection established with account:", accounts[0]);
        return contract;
    } catch (error) {
        console.error("Error in createEthereumContract:", error);
        throw error;
    }
};