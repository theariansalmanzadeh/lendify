import React from "react";
import styles from "../styles/sass/layout/demoPlatform.module.scss";
import platformImg from "../assets/platfromDemo.JPG";

function DemoPlatform() {
  return (
    <div className={styles.platform}>
      <img src={platformImg} alt="platfrom demo" />
    </div>
  );
}

export default DemoPlatform;
