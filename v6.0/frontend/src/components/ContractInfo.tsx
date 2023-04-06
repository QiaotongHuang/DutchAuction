import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import {
  NoEthereumProviderError,
  UserRejectedRequestError,
} from "@web3-react/injected-connector";
import { ethers } from "ethers";
import { ChangeEvent, ReactElement, useState } from "react";
import styled from "styled-components";
import { Provider } from "../utils/provider";
import BasicDutchAuctionArtifact from "../artifacts/contracts/BasicDutchAuction.sol/BasicDutchAuction.json";

function getErrorMessage(error: Error): string {
  let errorMessage: string;

  switch (error.constructor) {
    case NoEthereumProviderError:
      errorMessage =
        "No Ethereum browser extension detected. Please install MetaMask extension.";
      break;
    case UnsupportedChainIdError:
      errorMessage = "You're connected to an unsupported network.";
      break;
    case UserRejectedRequestError:
      errorMessage =
        "Please authorize this website to access your Ethereum account.";
      break;
    default:
      errorMessage = error.message;
  }

  return errorMessage;
}

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

export function ContractInfo(): ReactElement {
  const context = useWeb3React<Provider>();
  const { library, error } = context;
  const [reservePriceLookUp, setReservePriceLookUp] = useState<number>();
  const [priceDecrementLookUp, setPriceDecrementLookUp] = useState<number>();
  const [contractAddress, setContractAddress] = useState<string>("");
  const [currentPriceLookUp, setCurrentPrice] = useState<number>();
  const [winner, setWinner] = useState<string>("");
  const [seller, setSeller] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>();

  const handleContractAddressChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setContractAddress(event.target.value);
  };

  const handleGetInfo = async () => {
    const basicDutchAuction = new ethers.Contract(
      contractAddress,
      BasicDutchAuctionArtifact.abi,
      library
    );
    const reservePriceLookUp = await basicDutchAuction.reservePrice();
    const priceDecrementLookUp = await basicDutchAuction.offerPriceDecrement();
    const end = await basicDutchAuction.ended();
    const currentPrice = end ? reservePriceLookUp : await basicDutchAuction.getPrice();
    const winner = await basicDutchAuction.winner();
    const seller = await basicDutchAuction.seller();
    const bidAmount = await basicDutchAuction.amount();
    setReservePriceLookUp(reservePriceLookUp.toNumber());
    setPriceDecrementLookUp(priceDecrementLookUp.toNumber());
    setCurrentPrice(currentPrice.toNumber());
    setWinner(winner);
    setSeller(seller);
    setBidAmount(bidAmount.toNumber());
  };

  if (!!error) {
    window.alert(getErrorMessage(error));
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <label>Auction Address: </label>
        <input
          onChange={handleContractAddressChange}
          type="text"
          value={contractAddress}
        />

      </div>

      <div
        style={{
          background: "blue",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span>
          <StyledButton onClick={handleGetInfo}> Show Info</StyledButton>
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h4>Dutch Auction Info: </h4>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridGap: "1rem",
        }}
      >
        <label> Seller: </label>
        <input type="text" value={seller} readOnly />
        <label> Winner: </label>
        <input type="text" value={winner} readOnly />
        <label> Current Price: </label>
        <input type="text" value={currentPriceLookUp} readOnly />
        <label> Reserve Price: </label>
        <input type="text" value={reservePriceLookUp} readOnly />
        <label> Price Decrement: </label>
        <input type="text" value={priceDecrementLookUp} readOnly />
        <label> Bid Amount: </label>
        <input type="text" value={bidAmount} readOnly />
      </div>
    </>
  );
}
