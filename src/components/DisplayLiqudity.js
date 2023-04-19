import React from "react";
import { ethers } from "ethers";
import styles from "../styles/sass/pages/lp.module.scss";
import { createContract } from "../utils/helper";
import { useSelector } from "react-redux";

function DisplayLiqudity({ position, deadline, contractAddress, userAddress }) {
  const provider = useSelector(({ web3 }) => web3.provider);

  const claimNftHandler = async () => {
    const contract = createContract(contractAddress, provider);

    const res = await contract.takingCollaretal();

    await res.wait();
  };

  console.log(userAddress);
  if (userAddress === "")
    return (
      <div className={styles.noLiquidity}>
        <p>
          Please go to <span>Platform</span> section and connect your wallet
        </p>
      </div>
    );
  if (position.length === 0)
    return (
      <div className={styles.noLiquidity}>
        <p>Your not a liquidity provider</p>
      </div>
    );
  else {
    return (
      <div className={styles.liquidityAddress}>
        <ul>
          {position.map((position, indx) => {
            return (
              <li key={indx}>
                <div className={styles.index}>{indx + 1}</div>
                <div className={styles.details}>
                  <p>
                    amount : {ethers.utils.formatEther(position.amount)} Eth
                  </p>
                  <p>state : {position.available ? "available" : "in use"}</p>
                  {!position.available && (
                    <button
                      onClick={claimNftHandler}
                      disabled={!deadline ? true : false}
                    >
                      Claim NFT
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default DisplayLiqudity;
