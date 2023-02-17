import { ethers } from "hardhat";

async function main() {
  const reservePrice = 5000;
  const numBlocksAuctionOpen = 50;
  const offerPriceDecrement = 100;
  const _nftTokenId = 777;

  const [owner, otherAccount] = await ethers.getSigners();

  const BasicNFTFactory = await ethers.getContractFactory("BasicNFT");
  const BasicNFT = await BasicNFTFactory.deploy();

  //NFT mint
  BasicNFT.mint(owner.address, _nftTokenId);
  const NFTDutchAuctionFactory = await ethers.getContractFactory("NFTDutchAuction");
  const NFTDutchAuction = await NFTDutchAuctionFactory.deploy(owner.address, _nftTokenId, reservePrice, numBlocksAuctionOpen, offerPriceDecrement);

  //NFT approve
  BasicNFT.approve(NFTDutchAuction.address, _nftTokenId);

  console.log(`NFT Dutch Auction deployed successfully`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
