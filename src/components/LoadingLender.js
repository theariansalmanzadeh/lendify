import React from "react";
import styles from "../styles/sass/layout/loadLender.module.scss";
import { ImSpinner } from "react-icons/im";

function LoadingLender() {
  return (
    <div className={styles.loading}>
      <ImSpinner className={styles.spinner} />
    </div>
  );
}

export default LoadingLender;
