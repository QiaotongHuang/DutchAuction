pragma solidity ^0.8.0;

//Extend the IERC721 contract interface to use the ERC721 methods in this contract, we will need them for use with our NFT.
interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint _nftId
    ) external;
}

contract dutchAuction {
    IERC721 public immutable nft;
    uint public immutable nftId;

    address payable public immutable seller;
    uint public immutable numBlocksAuctionOpen;
    uint public immutable reservePrice;
    uint public immutable initialPrice;
    uint public immutable offerPriceDecrement;
    bool ended;

    //The above state variables are initialized in the constructor.
    constructor(
        uint _reservePrice,
        uint _offerPriceDecrement,
        uint _numBlocksAuctionOpen,
        address _nft,
        uint _nftId
    ) {
        //Set the seller as the deployer of the contract.
        seller = payable(msg.sender);
        reservePrice = _reservePrice;
        offerPriceDecrement = _offerPriceDecrement;
        numBlocksAuctionOpen = _numBlocksAuctionOpen;
        initialPrice = _reservePrice + _offerPriceDecrement * _numBlocksAuctionOpen;
        ended = false;

        nft = IERC721(_nft);
        nftId = _nftId;
    }

    //A function/method named getPrice() to get the current price of the NFT.
    function getPrice() public view returns (uint) {
        return initialPrice - block.number * offerPriceDecrement;
    }

    //A function to buy the NFT.
    function buy() external payable {

        //A check to ensure that the current block quantity ensures that the asking price is not lower than the minimum price, and an error message is displayed if the check fails.
        require(!ended, "auctionEnd has already been called")
        require(block.number <= numBlocksAuctionOpen, "This auction has ended");

        //Variable price, used to store the current price of the NFT, which will be obtained from the getPrice() method.
        uint price = getPrice();
        
        //Check to ensure that the amount of ETH sent by the bidder/buyer ( msg.value ) is always greater than or equal to the current price of the NFT, if the check fails an error message will be displayed.
        require(msg.value >= price, "The amount of Wei sent is less than the price of token");
        
        //Use the transferFrom function of IERC721 to transfer nft. NFT will be identified with the help of nftId and will be transferred from the seller to the current msg.sender (i.e. the person currently interacting with the contract).
        nft.transferFrom(seller, msg.sender, nftId);
        
        //The variable refund is used to store any excess ETH amount left over from the buyer's purchase of NFT and is calculated by subtracting the amount of ETH sent by the buyer ( msg.value ) from the current price of NFT, i.e. price.
        uint refund = msg.value - price;
        //Check if the value of the refund variable is zero, if so the contract will send the value back to the buyer.
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
            ended = true;
        }

        //Use the selfdestruct function to delete the contract and transfer the ETH to the seller.
        selfdestruct(seller);
    }
}