import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import styles from "../styles/sass/layout/chainSupport.module.scss";
import { displayAccount, renameChain } from "../utils/helper";

function ChainSupport() {
  const { accountAddress, netWorkName } = useSelector(({ web3 }) => web3);

  const navigate = useNavigate();

  return (
    <div className={styles.blockchainInfo}>
      <div className={styles.chainDetails}>
        {netWorkName ? <p>{renameChain(netWorkName)}</p> : <p>no chain</p>}
      </div>
      <div className={styles.chainDetails}>
        {accountAddress ? (
          <p>{displayAccount(accountAddress)}</p>
        ) : (
          <p>no wallet</p>
        )}
      </div>
      {accountAddress !== "" && (
        <button
          className={styles.chainDetailsBtn}
          onClick={() => navigate("/platform/dashboard")}
        >
          Dashboard
        </button>
      )}
    </div>
  );
}

export default ChainSupport;
