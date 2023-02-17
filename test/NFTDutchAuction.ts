import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("NFT Dutch Auction Test", function () {
  const reservePrice = 5000;
  const numBlocksAuctionOpen = 50;
  const offerPriceDecrement = 100;
  const _nftTokenId = 777;
 
  async function deployBasicNFTFixture() {

    // Contracts are deployed using the first account by default
    const [owner, otherAccount, anotherAccount] = await ethers.getSigners();

    const BasicNFTFactory = await ethers.getContractFactory("BasicNFT");
    const BasicNFT = await BasicNFTFactory.deploy();
    return { BasicNFT, owner, otherAccount, anotherAccount };
  }

  async function deployNFTDutchAuctionFixture() {

    const { BasicNFT, owner, otherAccount, anotherAccount } = await deployBasicNFTFixture();
    //NFT mint
    BasicNFT.mint(owner.address, _nftTokenId);
    const NFTDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction");
    const NFTDutchAuction = await NFTDutchAuctionFactory.deploy(BasicNFT.address, _nftTokenId, reservePrice, numBlocksAuctionOpen, offerPriceDecrement);

    //NFT approve
    await BasicNFT.approve(NFTDutchAuction.address, _nftTokenId);

    return { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount };
  }


  describe("Auction Deployment Test", function () {

    it("Compare if the owner of the BasicNFT approves the _nftTokenId to the auction contract", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await BasicNFT.ownerOf(_nftTokenId)).to.equal(owner.address);
    });

    it("nftId in auction should be equal to the approved nftId", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await NFTDutchAuction.nft()).to.equal(BasicNFT.address);
      expect(await NFTDutchAuction.nftId()).to.equal(_nftTokenId);
    });

  });


  describe("Auction Bid Test", function () {

    it("Bids below the set price should fail", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(otherAccount).auctionMint({value: 4900, gasPrice: 15000000000});
      expect(await NFTDutchAuction.ended()).to.equal(false);
    });

    it("The owner of the auction contract can bid successfully", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(owner).auctionMint({value: 10000, gasPrice: 15000000000});
      expect(await NFTDutchAuction.ended()).to.equal(true);
      expect(await BasicNFT.ownerOf(_nftTokenId)).to.equal(owner.address);
    });

    it("A bid at a sufficient price should succeed", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(otherAccount).auctionMint({value: 10000, gasPrice: 15000000000});
      expect(await NFTDutchAuction.ended()).to.equal(true);
      expect(await BasicNFT.ownerOf(_nftTokenId)).to.equal(otherAccount.address);
    });

    it("Bids without enough gasprice will fail", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(otherAccount).auctionMint({value: 10000, gasPrice: 0});
      expect(await NFTDutchAuction.ended()).to.equal(false);
    });

    it("Bids from other accounts should fail after a successful bid", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      NFTDutchAuction.connect(otherAccount).auctionMint({value: 10000, gasPrice: 15000000000});
      expect(await NFTDutchAuction.ended()).to.equal(true);
      var promise = NFTDutchAuction.connect(anotherAccount).auctionMint({value: 10000, gasPrice: 15000000000});
      expect(await BasicNFT.ownerOf(_nftTokenId)).to.equal(otherAccount.address);
    });

  });


  describe("Auction End Test", function () {

    it("account can only be ended by the owner", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(otherAccount).auctionEnded();
      expect(await NFTDutchAuction.ended()).to.equal(false);
      var promise = NFTDutchAuction.connect(anotherAccount).auctionEnded();
      expect(await NFTDutchAuction.ended()).to.equal(false);
    });

    it("owner can end the auction after the end of the program", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(owner).auctionEnded();
      expect(!(await NFTDutchAuction.ended())).to.equal(true);
    });

    it("owner can not end the auction before the end of the program", async function () {
      const { BasicNFT, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(owner).auctionEnded();
      expect(await NFTDutchAuction.ended()).to.equal(false);
    });

  });

});
