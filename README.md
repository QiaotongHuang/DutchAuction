# Dutch Auction DApp Project
This project aims to build a decentralized application for a Dutch Auction. 

## Version 1.0

### Project Structure
- Create a new directory named v1.0 and initialize a Hardhat project.

### Contract
- Implement BasicDutchAuction.sol, a Dutch auction contract.

### Functionality
- Allow the seller to set parameters such as reserve price, auction duration, and decrement rate.
- Conduct the auction where bidders can submit bids.
- Determine the winning bid and transfer funds to the seller.

### Testing
- Write comprehensive test cases and generate Solidity coverage reports.

## Version 2.0

### Project Structure
- Create a new directory named v2.0 and initialize a new Hardhat project.

### Contract
- Create NFTDutchAuction.sol, similar to BasicDutchAuction but for selling NFTs.

### Integration
- Understand ERC721 contract and implement functionality to mint, transfer, and manage NFTs.

### Testing
- Write tests to ensure the correct functioning of the NFT auction contract.

## Version 3.0

### Project Structure
- Initialize a new Hardhat project in the v3.0 directory.

### Contract
- Develop NFTDutchAuction_ERC20Bids.sol, accepting ERC20 bids instead of Ether.

### Integration
- Integrate ERC20 token functionality into the auction contract.

### Testing
- Thoroughly test the ERC20 bidding functionality and generate Solidity coverage reports.

## Version 4.0

### Contract Upgradeability
- Add an upgrade proxy to make NFTDutchAuction_ERC20Bids.sol upgradeable.

### Documentation
- Follow the guidelines for creating upgradeable contracts using the UUPS proxy pattern.
- Use the UUPS proxy instead of a transparent proxy: https://docs.openzeppelin.com/contracts/4.x/api/proxy 

## Version 5.0

### Enhancement
- Read https://eips.ethereum.org/EIPS/eip-2612    
- Read https://eips.ethereum.org/EIPS/eip-712
- Implement ERC20Permit functionality for ERC20 tokens.

### Testing
- Write test cases to validate the permit functionality within the context of bidding in the auction.

## Version 6.0 

### Project Structure
- Initialize a new Hardhat project in the v6.0 directory.


### UI Development
- Develop a ReactJS user interface for BasicDutchAuction.sol.
- Read: https://support.chainstack.com/hc/en-us/articles/4408642503449-Using-MetaMask-with-a-Hardhat-node
- Read: https://www.web3.university/article/how-to-build-a-react-dapp-with-hardhat-and-metamask  
- You may use this starter repo:
  https://github.com/ChainShot/hardhat-ethers-react-ts-starter  
  Instructions to get the app working:  
    *cd hardhat-ethers-react-ts-starter*  
    *yarn install*  
    *yarn hardhat compile*  
    *cd frontend*  
    *yarn install*  
    *yarn start* 

### Features
- Enable users to deploy auctions, view auction information, and submit bids.

### Testing
- Ensure the functionality of each section and test interactions with Metamask.

## Version 7.0

### Deployment
- Deploy the v6.0 DApp on the Goerli Ethereum testnet.

### UI Hosting
- Host the UI through IPFS to enable access via an ipfs:// URL. 
  For example if your CID is QmRgCTtKd91QkgoTiJQky57pCRda2drKEvTyFkUznaoKm3, the URL to access the content is ipfs://QmRgCTtKd91QkgoTiJQky57pCRda2drKEvTyFkUznaoKm3 
  Steps:  
    *Generate build files for your UI*  
    *Install IPFS desktop and IPFS browser plugin*  
    *Pin your UI build files to your IPFS Desktop node*  
    *Add the IPFS url to your README.md file in your repo*  
    *Present your fully functioning app to the TA:*  
    *Show that your contracts are deployed on a testnet*  
    *Show that your UI accessible by anyone through IPFS url*  
    *Show that users can interact with your UI through IPFS and the Metamask plugin by:*  
    *deploying a new BasicDutchAuction*  
    *submitting a winning bid*  
    *Use IPNS to generate a fixed name for your UI: https://docs.ipfs.tech/concepts/ipns/#mutability-in-ipfs*  

### Presentation
- Demonstrate the fully functioning app, including contract deployment, bid submission, and IPFS accessibility.

### IPNS Integration
- Utilize IPNS to generate a fixed name for the UI and enhance accessibility.

**Further Versions:**
- Add more versions based on these solidity patterns:  
  https://github.com/dragonfly-xyz/useful-solidity-patterns

**IPFS URL:** ipfs://QmdTZg4sAa8x9cdGDL6RZj9wH3AEAJNgG2aPAPduXgt34k


