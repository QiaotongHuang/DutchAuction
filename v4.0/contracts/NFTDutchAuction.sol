// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

contract NFTDutchAuction is Initializable, UUPSUpgradeable {
    address public winner;
    uint256 public amount;
    uint256 public reservePrice;
    uint256 public numBlocksAuctionOpen;
    uint256 public offerPriceDecrement;
    address public owner;
    uint256 public lastBlockNumber;
    uint256 public initialPrice;
    bool public ended;

    IERC721 public nft;
    uint256 public nftId;

    IERC20 public bid;

    event AuctionEnded(address winner, uint256 amount);
    event Bid(address bidder, uint256 amount);

    function initialize(
        address erc20TokenAddress,
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice,
        uint256 _numBlocksAuctionOpen,
        uint256 _offerPriceDecrement
    ) public initializer {
        reservePrice = _reservePrice;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        offerPriceDecrement = _offerPriceDecrement;
        //Set the owner as the deployer of the contract.
        owner = msg.sender;
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

    function _authorizeUpgrade(address) internal override {}

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
        require(_amount >= auctionPrice, "your bid is lower than set value");
        require(bid.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(msg.sender != owner, "owner can not bid");

        // transfer BasicNFT
        nft.transferFrom(owner, msg.sender, nftId);

        // transfer ERC20 token
        if (msg.sender != owner) {
            bid.transferFrom(msg.sender, owner, _amount);
        }
        winner = msg.sender;
        amount = _amount;
        ended = true;
        emit Bid(winner, _amount);
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

        emit AuctionEnded(msg.sender, reservePrice);
    }
}
