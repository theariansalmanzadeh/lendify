import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/sass/components/addLiquidityModal.module.scss";
import { ethers } from "ethers";

function AddPostionModal({ closeHander, refreshPage }) {
  const [iserror, setIsError] = useState(false);

  const valueRef = useRef();

  const addressOwner = useSelector(({ web3 }) => web3.accountAddress);
  const factoryContract = useSelector(
    ({ contractInfo }) => contractInfo.contractQueen
  );

  const changeAddressHandler = () => {};

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log(valueRef.current.value);
    if (Number(valueRef.current.value) === 0) return;

    const valueEth = valueRef.current.value;
    console.log(ethers.utils.parseEther(valueEth));
    const res = await factoryContract.liquidityProvider({
      value: ethers.utils.parseEther(valueEth),
    });
    await res.wait();

    valueRef.current.value = "";
    closeHander(false);
    refreshPage(true);
  };

  return (
    <div className={styles.addLiquidityModal}>
      <button onClick={() => closeHander(false)} className={styles.btnClose}>
        &times;
      </button>
      <h4>Add liqudity</h4>
      <form onSubmit={submitHandler}>
        <input value={addressOwner} onChange={changeAddressHandler} />
        <label>value Add (in ETH)</label>
        <input
          placeholder="0.1"
          type="text"
          className={iserror ? `${styles.error}` : ""}
          ref={valueRef}
        />
        <button>Add value</button>
      </form>
    </div>
  );
}

export default AddPostionModal;
