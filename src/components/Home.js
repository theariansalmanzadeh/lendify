import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/sass/pages/home.module.scss";
import DemoPlatform from "./DemoPlatform.js";

function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.homepage}>
      <div>
        <h1>lendify</h1>
        <p>the first lending app for NFTs</p>
        <button onClick={() => navigate("/platform")}>To App</button>
      </div>

      <DemoPlatform />
    </div>
  );
}

export default Home;
