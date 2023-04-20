import React from "react";
import loadingStyle from "../styles/sass/components/loadingCom.module.scss";

function TransactionLoader() {
  return (
    <div className={loadingStyle.wrapper}>
      <div className={loadingStyle["lds-roller"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>please wait until transaction</p>
    </div>
  );
}

export default TransactionLoader;
