// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract NFTDutchAuction is Initializable, UUPSUpgradeable {
    
    address public seller;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    address public owner;
    uint256 public auctionStartTime;
    uint256 public startBlock;
    uint256 public initialPrice;
    bool public ended;

    IERC721 public nft;
    uint256 public nftId;

    IERC20 public bid;
    
    event Bid(address indexed bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    function initialize(
        address erc20TokenAddress,
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice, 
        uint256 _numBlocksAuctionOpen, 
        uint256 _offerPriceDecrement) initializer public {
            reservePrice = _reservePrice;
            numBlocksAuctionOpen = _numBlocksAuctionOpen;
            offerPriceDecrement = _offerPriceDecrement;
            //Set the owner as the deployer of the contract.
            owner = msg.sender;
            initialPrice = reservePrice + (numBlocksAuctionOpen * offerPriceDecrement);
            auctionStartTime = block.timestamp;
            startBlock = block.number;
            seller = msg.sender;
            ended = false;

            nft = IERC721(erc721TokenAddress);
            nftId = _nftTokenId;

            bid = IERC20(erc20TokenAddress);

    }
    
    function _authorizeUpgrade(address) internal override {}
    
    // query auction price function
    function getAuctionPrice() public view returns(uint256){
        require(block.number <= startBlock + numBlocksAuctionOpen, "The auction has ended");
        uint256 auctionPrice = initialPrice - ((block.number - startBlock)* offerPriceDecrement);
        return auctionPrice;
    }

    // auction bid function
    function auctionMint(uint256 _amount) external payable{
        // conditions
        require(!ended, "The auction has ended");
        require(msg.sender != seller, "the seller can not bid");
        require(block.timestamp < auctionStartTime + (numBlocksAuctionOpen * 15), "The auction has ended");
        uint256 auctionPrice = getAuctionPrice();
        require(_amount >= auctionPrice, "your bid is lower than set value");
        require(bid.balanceOf(msg.sender) >= _amount, "Insufficient balance");

        // transfer BasicNFT
        nft.transferFrom(seller, msg.sender, nftId);
        
        // transfer ERC20 token
        if(msg.sender != seller){
            bid.transferFrom(msg.sender, seller, _amount);
        }
        ended = true;
        emit Bid(msg.sender, _amount);
    }

    // end the auction function
    function auctionEnded() external{
        // conditions
        require(block.timestamp < auctionStartTime + (numBlocksAuctionOpen * 15), "Auction is still in progress");
        require(!ended, "Auction already ended");
        require(msg.sender == seller,"only the owner of this contract can end the auction");

        emit AuctionEnded(msg.sender, reservePrice);
    }

}
