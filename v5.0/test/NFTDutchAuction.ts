import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("NFT Dutch Auction Test", function () {
  const reservePrice = 5000;
  const numBlocksAuctionOpen = 50;
  const offerPriceDecrement = 100;
  const _nftTokenId = 777;

  async function deployBasicNFTAndBidTokenFixture() {

    // Contracts are deployed using the first account by default
    const [owner, otherAccount, anotherAccount] = await ethers.getSigners();

    const BasicNFTFactory = await ethers.getContractFactory("BasicNFT");
    const BasicNFT = await BasicNFTFactory.deploy();

    const BidTokenFactory = await ethers.getContractFactory("BidToken");
    const BidToken = await BidTokenFactory.deploy("Bid Token", "BID");

    return { BasicNFT, BidToken, owner, otherAccount, anotherAccount };
  }

  async function deployNFTDutchAuctionFixture() {

    const { BasicNFT, BidToken, owner, otherAccount, anotherAccount } = await deployBasicNFTAndBidTokenFixture();

    //NFT mint
    BasicNFT.mint(owner.address, _nftTokenId);
    const NFTDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction");
    const NFTDutchAuction = await upgrades.deployProxy(NFTDutchAuctionFactory, [BidToken.address, BasicNFT.address, _nftTokenId, reservePrice, numBlocksAuctionOpen, offerPriceDecrement], { kind: 'uups', initializer: 'initialize' });
    //NFT approve
    await BasicNFT.approve(NFTDutchAuction.address, _nftTokenId);

    //Bid Token mint
    BidToken.approve(owner.address, 10000000000);
    BidToken.transferFrom(owner.address, otherAccount.address, 50000);
    BidToken.transferFrom(owner.address, anotherAccount.address, 50000);
    BidToken.connect(otherAccount).approve(NFTDutchAuction.address, 50000);
    BidToken.connect(anotherAccount).approve(NFTDutchAuction.address, 50000);

    const ownerBid = await BidToken.balanceOf(owner.address);
    const otherAccountBid = await BidToken.balanceOf(otherAccount.address);
    const anotherAccountBid = await BidToken.balanceOf(anotherAccount.address);
    // console.log(`\n ownerBid:` + ownerBid + `\n otherAccountBid:` + otherAccountBid + `\n anotherAccountBid:` + anotherAccountBid);

    return { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount };
  }

  describe("Auction Deployment Test", function () {

    it("BasicNFT belong to owner", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await BasicNFT.ownerOf(777)).to.equal(owner.address);
    });

    it("balance of owner in BasicNFT should be 1", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await BasicNFT.balanceOf(owner.address)).to.equal(1);
    });

    it("balance of other account in BasicNFT should be 0", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await BasicNFT.balanceOf(otherAccount.address)).to.equal(0);
    });

    it("tokenId of BasicNFT should be approved to another account", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      await BasicNFT.approve(otherAccount.address, 777);
      expect(await BasicNFT.getApproved(777)).to.equal(otherAccount.address);
    });

    it("All tokenId of BasicNFT can be approved to another account", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      await BasicNFT.setApprovalForAll(otherAccount.address, true);
      expect(await BasicNFT.isApprovedForAll(owner.address, otherAccount.address)).to.equal(true);
    });

    it("All tokenId of BasicNFT can be approved to another account", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      await BasicNFT.mint(owner.address, 888);
      expect(await BasicNFT.ownerOf(888)).to.equal(owner.address);
    });

    it("BasicNFT can be transfered to another account", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      await BasicNFT.transferFrom(owner.address, otherAccount.address, 777);
      expect(await BasicNFT.ownerOf(777)).to.equal(otherAccount.address);
    });



    it("reserve price should be 5000", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await NFTDutchAuction.reservePrice()).to.equal(reservePrice);
    });

    it("numBlocksAuctionOpen should be 50", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await NFTDutchAuction.numBlocksAuctionOpen()).equal(numBlocksAuctionOpen);
    });

    it("seller should be the owner of contract", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await NFTDutchAuction.seller()).to.equal(owner.address);
    });

    it("offerPriceDecrement should be 100", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await NFTDutchAuction.offerPriceDecrement()).to.equal(offerPriceDecrement);
    });

    it("initial price should be 10000", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await NFTDutchAuction.initialPrice()).to.equal(10000);
    });

    it("nftId in auction should be equal to the approved nftId", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      expect(await NFTDutchAuction.nft()).to.equal(BasicNFT.address);
      expect(await NFTDutchAuction.nftId()).to.equal(_nftTokenId);
    });

    it("offchain sign to permit tokens", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      const name = "Bid Token";
      const version = "1";
      const nonce = 0;
      const deadline = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now
      const value = ethers.utils.parseUnits("100", "ether");

      const domain = {
        name,
        version,
        chainId: await owner.getChainId(),
        verifyingContract: BidToken.address,
      };

      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const message = {
        owner: owner.address,
        spender: otherAccount.address,
        value,
        nonce,
        deadline,
      };

      const signature = await owner._signTypedData(domain, types, message);
      const sig = ethers.utils.splitSignature(signature);

      await BidToken.permit(
        owner.address,
        otherAccount.address,
        value,
        deadline,
        sig.v,
        sig.r,
        sig.s
      );

      expect(await BidToken.allowance(owner.address, otherAccount.address)).to.equal(
        value
      );
    });

  });


  describe("Auction Bid Test", function () {

    it("Bids below the set price should fail", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(anotherAccount).auctionMint(500, { value: 0, gasPrice: 15000000000 });
      expect(await NFTDutchAuction.ended()).to.equal(false);
    });

    it("The owner of the auction contract cannot bid", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(owner).auctionMint(10000, { value: 0, gasPrice: 15000000000 });
      expect(await NFTDutchAuction.ended()).to.equal(false);
      expect(await BasicNFT.ownerOf(_nftTokenId)).to.equal(owner.address);
    });

    it("A bid at a sufficient price should succeed", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      // console.log(`\n otherAccountBid:` + await BidToken.balanceOf(otherAccount.address));
      var promise = NFTDutchAuction.connect(otherAccount).auctionMint(10000, { value: 0, gasPrice: 15000000000 });
      expect(await NFTDutchAuction.ended()).to.equal(true);
      // expect(await BasicNFT.ownerOf(_nftTokenId)).to.equal(otherAccount.address);
    });

    it("Bids without enough gasprice will fail", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(otherAccount).auctionMint(10000, { value: 100000, gasPrice: 0 });
      expect(await NFTDutchAuction.ended()).to.equal(false);
    });

    it("Bids from other accounts should fail after a successful bid", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      NFTDutchAuction.connect(otherAccount).auctionMint(10000, { value: 0, gasPrice: 15000000000 });
      expect(await NFTDutchAuction.ended()).to.equal(true);
      var promise = NFTDutchAuction.connect(anotherAccount).auctionMint(10000);
      expect(await BasicNFT.ownerOf(_nftTokenId)).to.equal(otherAccount.address);
    });

  });


  describe("Auction End Test", function () {

    it("account can only be ended by the owner", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(otherAccount).auctionEnded();
      expect(await NFTDutchAuction.ended()).to.equal(false);
      var promise = NFTDutchAuction.connect(anotherAccount).auctionEnded();
      expect(await NFTDutchAuction.ended()).to.equal(false);
    });

    it("owner can end the auction after the end of the program", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(owner).auctionEnded();
      expect(!(await NFTDutchAuction.ended())).to.equal(true);
    });

    it("owner can not end the auction before the end of the program", async function () {
      const { BasicNFT, BidToken, NFTDutchAuction, owner, otherAccount, anotherAccount } = await deployNFTDutchAuctionFixture();
      var promise = NFTDutchAuction.connect(owner).auctionEnded();
      expect(await NFTDutchAuction.ended()).to.equal(false);
    });

  });

});
