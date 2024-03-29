import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import { ChangeEvent, ReactElement, useState } from "react";
import { Provider } from "../utils/provider";
import styled from "styled-components";
import { ethers } from "ethers";
import BasicDutchAuctionArtifact from "../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json";

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: orange;
  cursor: pointer;
  place-self: center;
`;

const getErrorMessage = (error: Error): string => {
  switch (error.constructor) {
    case NoEthereumProviderError:
      return "No Ethereum browser extension detected. Please install MetaMask extension.";
    case UnsupportedChainIdError:
      return "You're connected to an unsupported network.";
    case UserRejectedRequestError:
      return "Please authorize this website to access your Ethereum account.";
    default:
      return error.message;
  }
};

const Bid = (): ReactElement => {
  const { error, library } = useWeb3React<Provider>();
  const [contractAddress, setContractAddress] = useState<string>("");
  const [winner, setWinner] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>(0);

  const handleBid = async () => {
    if (!library || !contractAddress || !bidAmount) {
      window.alert(
        "Please connect to a wallet, then enter a contract address and bid amount"
      );
      return;
    }

    const basicDutchAuction = new ethers.Contract(
      contractAddress,
      BasicDutchAuctionArtifact.abi,
      library.getSigner()
    );
    const [currentPrice] = await Promise.all([
      basicDutchAuction.getPrice()
    ]);
    if (bidAmount < currentPrice) {
      window.alert(
        "Bid failed! Your bid must be greater than the current price!"
      );
      return;
    }
    try {
      const bid = await basicDutchAuction.bid(ethers.BigNumber.from(bidAmount));
      await bid.wait();
      if (bid) {
        window.alert("Bid successful");
        const winner1 = await basicDutchAuction.winner();
        setWinner(winner1);
      }
    } catch (e: any) {
      window.alert("Bid failed");
    }
  };

  if (error) {
    window.alert(getErrorMessage(error));
  }

  const handleContractAddressChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setContractAddress(event.target.value);
  };

  const handleBidAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBidAmount(Number(event.target.value));
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridGap: "1rem",
        }}
      >
        <label>Auction Address: </label>
        <input
          onChange={handleContractAddressChange}
          type="text"
          value={contractAddress}
        />
        <label> Bid Amount </label>
        <input
          type="number"
          min="0"
          onChange={handleBidAmountChange}
          value={bidAmount}
        />
      </div>

      <div
        style={{
          background: "orange",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span>
          {" "}
          <StyledButton onClick={handleBid}>Bid</StyledButton>{" "}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label>Winner: </label>
        <input type="text" value={winner} readOnly />
      </div>
    </>
  );
};

export default Bid;
