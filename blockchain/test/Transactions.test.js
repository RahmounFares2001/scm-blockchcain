// test/Transactions.test.js (version corrigée)
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transactions Contract Supplier Tests", function () {
  let Transactions;
  let contract;
  let admin, supplier1, supplier2;

  before(async () => {
    [admin, supplier1, supplier2] = await ethers.getSigners();
  });

  beforeEach(async () => {
    Transactions = await ethers.getContractFactory("Transactions");
    contract = await Transactions.deploy(admin.address);
    await contract.deployed();
  });

  it("Should create a supplier and log details", async () => {
    // Création du fournisseur
    const tx = await contract.connect(admin).createSupplier(
      supplier1.address,
      "TechMaterials Inc",
      "Lyon",
      "contact@techmaterials.com"
    );
    await tx.wait();

    // RÉCUPÉRATION CORRECTE DES DONNÉES
    const [
      addresses,
      names,
      ratings,
      fraudStatuses,
      places,
      emails,
      violations
    ] = await contract.getAllSuppliers();
    
    // Log des détails
    console.log("\n--- Supplier Created ---");
    console.log(`Address: ${supplier1.address}`);
    console.log(`Name: ${names[0]}`);
    console.log(`Place: ${places[0]}`);
    console.log(`Email: ${emails[0]}`);
    console.log(`Reliability: ${ratings[0]}/5`);
    console.log(`Fraud Status: ${fraudStatuses[0] ? '⚠️ Fraud' : '✅ Clean'}`);

    // Vérifications
    expect(addresses[0]).to.equal(supplier1.address);
    expect(names[0]).to.equal("TechMaterials Inc");
    expect(places[0]).to.equal("Lyon");
  });

  it("Should retrieve and log all suppliers", async () => {
    // Création de plusieurs fournisseurs
    await contract.connect(admin).createSupplier(
      supplier1.address,
      "ElectroParts",
      "Paris",
      "sales@electroparts.fr"
    );

    await contract.connect(admin).createSupplier(
      supplier2.address,
      "MetalWorks",
      "Marseille",
      "info@metalworks.com"
    );

    // RÉCUPÉRATION CORRECTE
    const [
      addresses,
      names,
      ratings,
      fraudStatuses,
      places,
      emails,
      violations
    ] = await contract.getAllSuppliers();
    
    // Log du tableau complet
    console.log("\n--- All Suppliers ---");
    addresses.forEach((address, index) => {
      console.log(`\nSupplier #${index + 1}`);
      console.log(`Address: ${address}`);
      console.log(`Name: ${names[index]}`);
      console.log(`Location: ${places[index]}`);
      console.log(`Email: ${emails[index]}`);
      console.log(`Rating: ${'⭐'.repeat(Number(ratings[index]))}`);
      console.log(`Violations: ${violations[index].join(', ') || 'None'}`);
    });

    // Vérifications
    expect(addresses.length).to.equal(2);
    expect(names).to.deep.equal(["ElectroParts", "MetalWorks"]);
    expect(places).to.include("Marseille");
  });
});