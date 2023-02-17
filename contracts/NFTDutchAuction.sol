// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 nftId
    ) external;
}


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

    event AuctionEnded(address winner, uint256 amount);

    constructor(
        address erc721TokenAddress,
        uint256 _nftTokenId,
        uint256 _reservePrice, 
        uint256 _numBlocksAuctionOpen, 
        uint256 _offerPriceDecrement
        ) payable{
            reservePrice = _reservePrice;
            numBlocksAuctionOpen = _numBlocksAuctionOpen;
            offerPriceDecrement = _offerPriceDecrement;
            owner = payable(msg.sender);
            lastBlockNumber = block.number + numBlocksAuctionOpen;
            initialPrice = reservePrice + numBlocksAuctionOpen * offerPriceDecrement;
            ended = false;

            nft = IERC721(erc721TokenAddress);
            nftId = _nftTokenId;
    }
    
    // query auction price function
    function getAuctionPrice() public view returns(uint256){
        require(block.number <= lastBlockNumber, "The auction has ended");
        uint256 auctionPrice = initialPrice - (lastBlockNumber - block.number) * offerPriceDecrement;
        return auctionPrice;
    }

    // auction bid function
    function auctionMint() external payable{
        // conditions
        require(!ended, "The auction has ended");
        require(block.number <= lastBlockNumber, "The auction has ended");
        uint256 auctionPrice = getAuctionPrice();
        require(msg.value >= auctionPrice, "your bid is lower than set value");

        // transfer BasicNFT
        nft.transferFrom(owner, msg.sender, nftId);
        
        // refund excessive value
        uint refund = msg.value - auctionPrice;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
            ended = true;
        }
        emit AuctionEnded(msg.sender, auctionPrice);
    }

    // end the auction function
    function auctionEnded() external{
        // conditions
        require(block.number > lastBlockNumber, "Auction is still in progress");
        require(!ended, "Auction already ended");
        require(msg.sender == owner,"only the owner of this contract can end the auction");
        
        // delete the contract and transfer the ETH to the seller
        selfdestruct(owner);
    }

}
