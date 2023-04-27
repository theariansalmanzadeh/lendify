import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLender,
  setIndexLp,
  setEthAmount,
} from "../store/contractNftSlice";
import LoadingLender from "./LoadingLender.js";
import styles from "../styles/sass/layout/lenderSection.module.scss";

function SelectLender() {
  const [isSelected, setIsSelected] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalLenders, setTotalLenders] = useState([]);
  const dispatch = useDispatch();

  const factoryContract = useSelector(
    ({ contractInfo }) => contractInfo.contractQueen
  );

  const selectLenderHandler = async (event) => {
    const target = event.target;
    const container = target.closest("ul");
    console.log(container);

    const elem = target.closest("li");
    const address = elem.getAttribute("data-set-lenderaddress");
    const amount = elem.getAttribute("data-set-eth");

    const indexLp = await factoryContract.addressToindexLender(address);
    console.log(Number(indexLp), address);

    setIsSelected(address);
    dispatch(selectLender(true));
    dispatch(setIndexLp(Number(indexLp)));
    dispatch(setEthAmount(amount));
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        const totalLenders = await factoryContract.getTotalLpinfos();

        const availableLenders = totalLenders.filter(
          (lender) => lender.available
        );
        setTotalLenders(availableLenders);

        setIsLoading(false);
      } catch (e) {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    dispatch(selectLender(false));
  }, [dispatch]);

  return (
    <div className={styles.lenderSection}>
      <p>Best options (choose a ether lender)</p>
      <div>
        {isLoading && <LoadingLender />}
        <ul onClick={selectLenderHandler}>
          {totalLenders.map((lender, indx) => {
            return (
              <li
                className={
                  isSelected === lender.addr ? `${styles.selected}` : ""
                }
                key={indx}
                data-set-lenderaddress={lender.addr}
                data-set-eth={lender.amount}
              >
                <p>Lender Address : {lender.addr}</p>
                <p>ETH amount : {ethers.utils.formatEther(lender.amount)}</p>
                <p>Intrest Rate : 10%</p>
                <p>Duration : 60 days</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default SelectLender;
