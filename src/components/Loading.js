import React from "react";
import { ImSpinner2 } from "react-icons/im";
import styles from "../styles/sass/components/loading.module.scss";

function Loading() {
  return (
    <div className={styles.loadingWrapper}>
      <ImSpinner2 />
    </div>
  );
}

export default Loading;
