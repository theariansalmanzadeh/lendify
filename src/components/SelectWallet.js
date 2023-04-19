import React, { useState } from "react";
import { ethers } from "ethers";
import { useDispatch } from "react-redux";
import ReactDOM from "react-dom";
import {
  setAccountAddress,
  setNetWork,
  setProvider,
  setSigner,
} from "../store/web3detailsSlice";
import styles from "../styles/sass/layout/sellectWallet.module.scss";
import Loading from "./Loading.js";
import { chainID } from "../utils/contractInfo";
import { getAllNFTs, getNftData } from "../utils/helper";

function SelectWallet({ toggleModal }) {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const sellectWalletHandler = async (event) => {
    const target = event.target;
    const elem = target.closest("button");

    if (!elem.classList.contains("wallet")) return;

    setIsLoading(true);

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider);
      const chain = await provider.getNetwork();

      if (chain.chainId !== `0x${chainID.toString(16)}`)
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${chainID.toString(16)}` }],
        });

      const addressAccount = await provider.listAccounts();

      const signer = provider.getSigner();
      console.log(signer, addressAccount);

      dispatch(setAccountAddress(addressAccount));
      dispatch(
        setNetWork({ netWorkName: chain.name, netWorkId: chain.chainId })
      );
      dispatch(setProvider(provider));
      dispatch(setSigner(signer));
      // console.log(chain);
    } catch (e) {
      console.log(e);
      alert("error in changing chain try again");
      return;
    }

    setIsLoading(false);
  };

  const SelletWalletModal = ({ onClose }) => {
    return (
      <React.Fragment>
        {isLoading && <Loading />}
        <div className={styles.selectWallet}>
          <button
            onClick={() => {
              onClose(false);
            }}
            className={styles.closeBtn}
          >
            &times;
          </button>
          <div
            onClick={(event) => {
              sellectWalletHandler(event);
              onClose(false);
            }}
          >
            <button className="wallet meta">
              <img src="./images/metamask.png" alt="metamask logo" />
              MetaMask
            </button>
            <button
              disabled={true}
              className={`wallet coin ${styles.disabledWallet}`}
            >
              <img src="./images/coinbase.webp" alt="coinbase logo" />
              CoinBase
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  return ReactDOM.createPortal(
    <SelletWalletModal onClose={toggleModal} />,
    document.getElementById("selectWallet")
  );
}

export default SelectWallet;
