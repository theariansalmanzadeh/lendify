import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChainSupport from "./chainSupport";
import SelectWallet from "./SelectWallet.js";
import stylesNoWallet from "../styles/sass/layout/noWallet.module.scss";
import styles from "../styles/sass/pages/lending.module.scss";
import DisplayNfts from "./DisplayNfts";

function Borrow() {
  const [isWallet, setIsWallet] = useState(false);
  const [connectWallet, setConnectWallet] = useState(false);

  const { accountAddress } = useSelector(({ web3 }) => web3);

  const connectWalletHandler = () => {
    setConnectWallet(true);
  };

  useEffect(() => {
    if (window.ethereum) {
      setIsWallet(true);
    }
  }, []);

  if (!isWallet)
    return (
      <React.Fragment>
        <div className={stylesNoWallet.noWallet}>
          <div>
            <p>no proper wallet found please istall one</p>
            <button>
              <img src="./images/metamask.png" alt="metamask logo" />
              MetaMask
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  if (isWallet && accountAddress === "") {
    return (
      <React.Fragment>
        {connectWallet && <SelectWallet toggleModal={setConnectWallet} />}
        <div className={styles.connectWallet}>
          <div>
            <p>connect your Wallet</p>
            <button onClick={connectWalletHandler}>Connect wallet</button>
          </div>
        </div>
      </React.Fragment>
    );
  } else return <DisplayNfts />;
}

export default Borrow;
