NFTDutchAuction v2.0 allows the seller to mint x number of nfts, then list a single one at a time in a Dutch Auction. The contract first address to successfuly bid at or above the current price is the winner. When a winning address is found, the contract immediately transfers Ether from the winner's account to the seller, and the nft from the seller to the winner. Also in v2.0 are test cases for both the MintNFT and NFTDutchAuction contracts

(base) vicken@Vickens-MacBook-Air DutchAuction v2.0 % npx hardhat coverage

# Version

> solidity-coverage: v0.8.2

# Instrumenting for coverage...

> MintNFT.sol
> NFTDutchAuction.sol

# Compilation:

Nothing to compile
No need to generate any newer typings.

# Network Info

> HardhatEVM: v2.12.6
> network: hardhat

MintNFT
Max Supply
✔ should set max supply of nfts minted to 10(index 0-9)
safeMint
✔ should mint 1 NFT to the owners address at index 0 (43ms)
✔ should not mint more tokens than the max supply (367ms)
tokenURI
✔ should return the URI of the given token

NFTDutchAuction
Checking Auction Values
✔ reserve price - 100 wei (73ms)
✔ num blocks auction open for - 10
✔ offer price decrement - 10 wei
✔ checking if initial price is 200 wei
setMintContractAddress
✔ checking mint contract address function
Checking Seller
✔ is owner of this contract the seller
✔ bid from seller account
Checking Bidders
✔ bidder has more than 0 wei
✔ bid accepted - 200 wei - sufficient amount
✔ bid rejected - 100 wei - insufficient amount
✔ multiple bids - first bid greater than current price, second bid lower
✔ multiple bids - both bids higher than current price
✔ check for winner
✔ auction ended - winner already chosen
✔ auction ended - reject bid because select number of blocks passed

19 passing (1s)

----------------------|----------|----------|----------|----------|----------------|
File | % Stmts | % Branch | % Funcs | % Lines |Uncovered Lines |
----------------------|----------|----------|----------|----------|----------------|
contracts/ | 89.29 | 58.33 | 92.86 | 90.24 | |
MintNFT.sol | 88.89 | 66.67 | 75 | 90 | 61 |
NFTDutchAuction.sol | 89.47 | 55.56 | 100 | 90.32 | 127,128,153 |
----------------------|----------|----------|----------|----------|----------------|
All files | 89.29 | 58.33 | 92.86 | 90.24 | |
----------------------|----------|----------|----------|----------|----------------|

> Istanbul reports written to ./coverage/ and ./coverage.json
