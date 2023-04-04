// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTDutchAuction {
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    address payable public immutable owner;
    uint256 public lastBlockNumber;
    uint256 public initialPrice;
    bool public ended;

    IERC721 public immutable nft;
    uint256 public immutable nftId;

    IERC20 public immutable bid;

    event AuctionEnded(address winner, uint256 amount);

    constructor(
        address erc20TokenAddress,
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) payable {
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        owner = payable(msg.sender);
        lastBlockNumber = block.number + numBlocksAuctionOpen;
        initialPrice =
            reservePrice +
            numBlocksAuctionOpen *
            offerPriceDecrement;
        ended = false;

        nft = IERC721(erc721TokenAddress);
        nftId = _nftTokenId;

        bid = IERC20(erc20TokenAddress);
    }

    // query auction price function
    function getAuctionPrice() public view returns (uint256) {
        require(block.number <= lastBlockNumber, "The auction has ended");
        uint256 auctionPrice = initialPrice -
            (lastBlockNumber - block.number) *
            offerPriceDecrement;
        return auctionPrice;
    }

    // auction bid function
    function auctionMint(uint256 _amount) external payable {
        // conditions
        require(!ended, "The auction has ended");
        require(block.number <= lastBlockNumber, "The auction has ended");
        uint256 auctionPrice = getAuctionPrice();
        require(_amount >= auctionPrice, "Check current price of auction");
        require(bid.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(msg.sender != owner, "owner can not bid");

        // transfer BasicNFT
        nft.transferFrom(owner, msg.sender, nftId);

        // transfer ERC20 token
        if (msg.sender != owner) {
            bid.transferFrom(msg.sender, owner, _amount);
        }
        ended = true;
        emit AuctionEnded(msg.sender, _amount);
    }

    // end the auction function
    function auctionEnded() external {
        // conditions
        require(block.number > lastBlockNumber, "Auction is still in progress");
        require(!ended, "Auction already ended");
        require(
            msg.sender == owner,
            "only the owner of this contract can end the auction"
        );

        // delete the contract and transfer the ETH to the seller
        selfdestruct(owner);
    }
}
