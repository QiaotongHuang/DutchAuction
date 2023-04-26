# Version

> solidity-coverage: v0.8.2

# Instrumenting for coverage...

> MintNFT.sol
> NFTDutchAuction_ERC20Bids.sol
> VToken.sol

# Compilation:

Nothing to compile
No need to generate any newer typings.

# Network Info

> HardhatEVM: v2.12.7
> network: hardhat

Auction
✔ VToken Contract Deployment (114ms)
✔ Should set the correct name and symbol
✔ Should mint 5,000 VTokens
✔ Should set the max supply correctly to 10,000
✔ Should not allow max supply to be set to 0
✔ Should not allow max supply to be greater than 10,000
✔ Should not mint tokens after max supply have been minted
✔ MintNFT Contract Deployment
✔ Should set max supply of NFTs minted to 10(index 0-9)
✔ Should not mint more tokens than the max supply (202ms)
✔ Should test NFT minting
✔ Should test safeMint from bidders account
✔ NFTDutchAuction Contract Deployment (50ms)
✔ Should check if sellers balance is currently 0
✔ Should check if initial price is 400 VToken
✔ Approval from NFTDutchAuction contract for bid
✔ Approval from ERC20 contract for bid
0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 has bid 450 VToken
✔ Should test bid functionality before approval
0x70997970c51812dc3a010c7d01b50e0d17dc79c8 has bid 400 VToken
Owners address 0x70997970c51812dc3a010c7d01b50e0d17dc79c8
✔ Should test the bid functionality
✔ reserve price - 200 VToken
✔ num blocks auction open for - 50
✔ offer price decrement - 4 VToken
Sellers address 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
✔ is owner of this contract the seller
✔ Checking to see if the NFT seller received the VTokens

24 passing (615ms)

--------------------------------|----------|----------|----------|----------|----------------|
File | % Stmts | % Branch | % Funcs | % Lines |Uncovered Lines |
--------------------------------|----------|----------|----------|----------|----------------|
contracts/ | 100 | 70.83 | 100 | 100 | |
MintNFT.sol | 100 | 66.67 | 100 | 100 | |
NFTDutchAuction_ERC20Bids.sol | 100 | 58.33 | 100 | 100 | |
VToken.sol | 100 | 100 | 100 | 100 | |
--------------------------------|----------|----------|----------|----------|----------------|
All files | 100 | 70.83 | 100 | 100 | |
--------------------------------|----------|----------|----------|----------|----------------|
