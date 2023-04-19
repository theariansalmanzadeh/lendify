import React, { useEffect, useState } from "react";
import DisplayLiqudity from "./DisplayLiqudity.js";
import styles from "../styles/sass/pages/lp.module.scss";
import ChainSupport from "./chainSupport";
import AddPostionModal from "./AddPostionModal.js";
import { useSelector } from "react-redux";
import { createContract } from "../utils/helper";

function LiquidityProvider() {
  const [addPosition, setAddPosition] = useState(null);
  const [positionPool, setPositionPool] = useState([]);
  const [childContractAddress, setChildContractAddress] = useState("");
  const [isDeadline, setIsDeadline] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const provider = useSelector((state) => state.web3.provider);
  const accountAddress = useSelector((state) => state.web3.accountAddress);
  const contractFactory = useSelector(
    (state) => state.contractInfo.contractQueen
  );

  useEffect(() => {
    if (!refresh) return;
    if (accountAddress === "") return;
    console.log(contractFactory);

    (async () => {
      try {
        const lenderStatus = await contractFactory.showLender();
        console.log({ ...lenderStatus });
        setPositionPool([...positionPool, { ...lenderStatus }]);
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

  return (
    <React.Fragment>
      <ChainSupport />
      {addPosition && (
        <AddPostionModal
          refreshPage={setRefresh}
          closeHander={setAddPosition}
        />
      )}
      <div className={styles.lpSection}>
        <h3>Pools</h3>
        <div className={styles.LPwrapper}>
          <div className={styles.box}>
            <DisplayLiqudity
              userAddress={accountAddress}
              position={positionPool}
              contractAddress={childContractAddress}
              deadline={isDeadline}
            />
          </div>
          {accountAddress !== "" && (
            <button onClick={setPositionHandler} className={styles.liqudity}>
              Add liqudity
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default LiquidityProvider;
