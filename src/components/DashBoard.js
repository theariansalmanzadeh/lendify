import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/sass/pages/dashboard.module.scss";
import avatar from "../assets/avatar.webp";
import ContractSign from "./ContractSign.js";
import TransactionLoader from "./TransactionLoader.js";

function DashBoard() {
  const [isContract, setIsContract] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const factoryContract = useSelector(
    ({ contractInfo }) => contractInfo.contractQueen
  );
  const address = useSelector(({ web3 }) => web3.accountAddress);

  useEffect(() => {
    (async () => {
      const contractAddress = await factoryContract.contractInfoNftLender(
        address
      );
      setIsContract(Number(contractAddress) !== 0 ? true : false);
    })();
  }, []);

  return (
    <div className={styles.dashboard}>
      {isLoading && <TransactionLoader />}
      <div className={styles.accountInfo}>
        <div className={styles.avatarWrapper}>
          <img src={avatar} alt="avatar" />
        </div>
        <p>
          Account address : <span>{address}</span>
        </p>
        {isContract && (
          <div>
            <h5>How to get funds</h5>

            <ol>
              <li>
                for getting the amount requested, first you have to transfer the
                ownership of your nft by clicking on the get fund botton
              </li>
              <li>after that wait until you can get the fund</li>
              <li>
                if you want to re-pay the borrowed fund you can do it by
                clicking on the repay botton
              </li>
              <li className={styles.cautions}>
                the amount you must pay back is the initial amount plus 10%
                intrest rate. you have 60 days for your repay
              </li>
            </ol>
          </div>
        )}
      </div>
      <div className={styles.contractWrapper}>
        <div className={styles.contract}>
          <ContractSign setLoading={setIsLoading} />
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
