import React, { useEffect, useState } from "react";
import styles from "../styles/sass/pages/totalliquidity.module.scss";
import { useSelector } from "react-redux";
import { ethers } from "ethers";

function TotalLiquidity() {
  const [totalProviders, setTotalProviders] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  const factoryContract = useSelector(
    ({ contractInfo }) => contractInfo.contractQueen
  );

  useEffect(() => {
    if (Object.keys(factoryContract).length === 0) {
      setIsConnected(false);
      return;
    }
    (async () => {
      const res = await factoryContract.getTotalLpinfos();

      setTotalProviders(res);
      setIsConnected(true);
      console.log(res);
    })();
  }, []);

  console.log(factoryContract);

  return (
    <div className={styles.totalLiquidity}>
      <div className={styles.container}>
        <p className={styles.heading}>All liquidity Providers</p>
        {!isConnected && <p>should first connect your Wallet</p>}
        {isConnected && (
          <ul>
            {totalProviders.map((lp, indx) => (
              <li key={indx}>
                <p>
                  <span>Address provider :</span>
                  {lp.addr}
                </p>

                <p>
                  {" "}
                  <span>liquidity Amount :</span>
                  {ethers.utils.formatEther(String(lp.amount))}
                </p>
                <p>
                  <span>State :</span>
                  {lp.available ? "available" : "in use"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TotalLiquidity;
