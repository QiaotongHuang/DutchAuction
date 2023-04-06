async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const factory = await ethers.getContractFactory("BasicDutchAuction");
    const BasicDutchAuction = await factory.deploy(2000, 5, 1000);

    console.log("BasicDutchAuction address:", BasicDutchAuction.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });