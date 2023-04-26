import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { assert } from "console";
// import { MintNFT } from "../typechain-types";
// import { NFTDutchAuction } from "../typechain-types/contracts/NFTDutchAuction";
// import { Contract, Signer } from "ethers";
// import { contracts } from "../typechain-types";


describe("Auction", function () {
  let seller: any;
  let account: any;

  let erc20ContractCreator: any;
  let mintERC20Token: any;

  let mintNFTToken: any;
  let nftContractCreator: any;
  
  let nftDutchAuctionToken: any;

  
  it("VToken Contract Deployment", async function ()  {
    const [owner, address1] = await ethers.getSigners();
    seller = owner;
    account = address1;
    const MintERC20Factory = await ethers.getContractFactory("VToken");
    erc20ContractCreator = await MintERC20Factory.deploy(10000);
    mintERC20Token = await erc20ContractCreator.deployed();
  });

  it("Should set the correct name and symbol", async () => {
    expect(await mintERC20Token.name()).to.equal("VToken");
    expect(await mintERC20Token.symbol()).to.equal("VT");
  });
  it("Should mint 5,000 VTokens", async function () {
    expect(mintERC20Token.mintERC20Token(account.address, 5000));
  });
  it("Should set the max supply correctly to 10,000", async () => {
    const maxSupply = 10000;
    expect(await mintERC20Token.maxSupply()).to.equal(maxSupply);
  });
  it("Should not allow max supply to be set to 0", async () => {
    const maxSupply = 0;
    const badMintERC20Factory = await ethers.getContractFactory("VToken", erc20ContractCreator);
    expect(badMintERC20Factory.deploy(0)).to.be.revertedWith("Max token supply must be greater than 0");
  });

  it("Should not allow max supply to be greater than 10,000", async () => {
    const maxSupply = 10001;
    const tooLargeMintERC20Factory = await ethers.getContractFactory("VToken", erc20ContractCreator);
    expect(tooLargeMintERC20Factory.deploy(10001)).to.be.revertedWith("Max token supply must be less than or equal to 10,000");
  });
  it("Should not mint tokens after max supply have been minted", async function () {
    expect(mintERC20Token.mintERC20Token(seller.address, 10000)).to.be.revertedWith("Number of tokens minted to this address should be less than the max supply");
  });

// -------------------------------------
  it("MintNFT Contract Deployment", async function ()  {
    const [owner, address1] = await ethers.getSigners();
    seller = owner;
    account = address1;
    const MintDutchAuctionFactory = await ethers.getContractFactory("MintNFT");
    nftContractCreator = await MintDutchAuctionFactory.deploy(10);
    mintNFTToken = await nftContractCreator.deployed();
  });

  it("Should set max supply of NFTs minted to 10(index 0-9)", async function () {
    expect(await mintNFTToken.maxSupply()).to.equal(10);
  });
  it("Should not mint more tokens than the max supply", async function () {
    for (let i = 0; i < 10; i++) {
      await mintNFTToken.safeMint(seller.address);
    }
    await expect(mintNFTToken.safeMint(seller.address)).to.be.revertedWith(
      "Max number of tokens minted"
    );
  });
  it("Should test NFT minting", async function () {
    await expect(mintNFTToken.safeMint(seller.address));
  });
  
  it("Should test safeMint from bidders account", async function ()  {
    await expect(mintNFTToken.connect(account).safeMint(account.address));
  });

  it("NFTDutchAuction Contract Deployment", async function () {
    const MintDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction_ERC20Bids");
    const mintNFTDutchAuction = await MintDutchAuctionFactory.deploy(mintERC20Token.address, mintNFTToken.address, 0, 200, 50, 4);
    nftDutchAuctionToken = await mintNFTDutchAuction.deployed();
  });
  it("Should check if sellers balance is currently 0", async function () {
    expect(await mintERC20Token.balanceOf(seller.address)).to.equal(0);
  });
  it("Should check if initial price is 400 VToken", async function () {
    expect(await nftDutchAuctionToken.getCurrentPrice()).to.equal(400);
  });

  it("Approval from NFTDutchAuction contract for bid", async function () {
    await mintNFTToken.approve(nftDutchAuctionToken.address, 0);
  });
  it("Approval from ERC20 contract for bid", async function () {
    await mintERC20Token.connect(account).approve(nftDutchAuctionToken.address, 450);
  });
  it("Should test bid functionality before approval", async function () {
    await expect(nftDutchAuctionToken.bid(450)).to.be.revertedWith("Owner cannot submit bid on own item");
  });

  it("Should test the bid functionality", async function () {
    await nftDutchAuctionToken.connect(account).bid(400);
  });

  // NFTDUTCHAUCTION_ERC20BIDS---------------------------------------
  it('reserve price - 200 VToken' , async function(){
    expect(await nftDutchAuctionToken.getReservePrice()).to.equal(200);
  });

  it('num blocks auction open for - 50' , async function(){
    expect(await nftDutchAuctionToken.getNumBlocksAuctionOpen()).to.equal(50);
  });

  it('offer price decrement - 4 VToken' , async function(){
    expect(await nftDutchAuctionToken.getPriceDecrement()).to.equal(4);
  });
  
  it('is owner of this contract the seller', async function(){
    expect( await nftDutchAuctionToken.getSellerAddress()).to.equal(seller.address);
  });

  it("Checking to see if the NFT seller received the VTokens", async function () {
    expect(await mintERC20Token.balanceOf(seller.address)).to.equal(await nftDutchAuctionToken.getCurrentPrice());
  });
});






  
