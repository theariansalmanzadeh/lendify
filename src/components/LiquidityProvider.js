import React, { useEffect, useState } from "react";
import DisplayLiqudity from "./DisplayLiqudity.js";
import styles from "../styles/sass/pages/lp.module.scss";
import ChainSupport from "./chainSupport";
import AddPostionModal from "./AddPostionModal.js";
import { useSelector } from "react-redux";
import { createContract } from "../utils/helper";
import TransactionLoader from "./TransactionLoader.js";
import { Link } from "react-router-dom";

function LiquidityProvider() {
  const [addPosition, setAddPosition] = useState(null);
  const [positionPool, setPositionPool] = useState([]);
  const [childContractAddress, setChildContractAddress] = useState("");
  const [isDeadline, setIsDeadline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const provider = useSelector((state) => state.web3.provider);
  const accountAddress = useSelector((state) => state.web3.accountAddress);
  const contractFactory = useSelector(
    (state) => state.contractInfo.contractQueen
  );

  const isDisabled = (provideravailability) => {
    if (provideravailability === false) return true;
    else if (provideravailability === undefined) {
      return false;
    }
  };

  useEffect(() => {
    if (!refresh) return;
    if (accountAddress === "") return;

    (async () => {
      try {
        const lenderStatus = await contractFactory.showLender();

        setPositionPool({ ...lenderStatus });
      } catch (e) {}
    })();

    (async () => {
      if (!positionPool.available) return;
      const lpContractAddress = await contractFactory.LpContractAddress();
      setChildContractAddress(lpContractAddress);

      const contract = createContract(lpContractAddress, provider);
      const deadline = await contract.isDeadlineReached();
      setIsDeadline(deadline);
    })();
    setRefresh(false);
  }, [accountAddress, refresh]);

  const setPositionHandler = () => {
    setAddPosition(true);
  };

  console.log(positionPool.available);
  return (
    <React.Fragment>
      <ChainSupport />
      {addPosition && (
        <AddPostionModal
          refreshPage={setRefresh}
          closeHander={setAddPosition}
          setIsLoading={setIsLoading}
        />
      )}
      {isLoading && <TransactionLoader />}
      <div className={styles.lpSection}>
        <h3>Pools</h3>
        <Link to="./totalUser" className={styles.link}>
          All Pools
        </Link>
        <div className={styles.LPwrapper}>
          <p className={styles.heading}>Your Liquidities</p>
          <div className={styles.box}>
            <DisplayLiqudity
              userAddress={accountAddress}
              position={positionPool}
              contractAddress={childContractAddress}
              deadline={isDeadline}
            />
          </div>
          {accountAddress !== "" && (
            <button
              disabled={isDisabled(positionPool.available)}
              onClick={setPositionHandler}
              className={
                !isDisabled(positionPool.available)
                  ? `${styles.liqudity}`
                  : `${styles.liqudity} ${styles.deactive}`
              }
            >
              Add liquidity
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default LiquidityProvider;
