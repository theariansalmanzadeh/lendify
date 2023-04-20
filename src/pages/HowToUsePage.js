import React from "react";
import styles from "../styles/sass/pages/about.module.scss";

function HowToUsePage() {
  return (
    <div className={styles.aboutPage}>
      <h3>How to use Lendify</h3>
      <p>
        for Both providing liquidity and lending ether the use must first
        coonect the metamask wallet as the image describes
      </p>
      <div className={styles.container}>
        <div className={styles.imgWrapper}>
          <img src="./images/howtouse1.jpg" alt="connect wallet" />
        </div>
      </div>
      <p>
        After that based on the users decision, the user can interact with the
        platform
      </p>
      <p>
        for providing liquidity user must go to the{" "}
        <span>liquidity provider</span> section and add liquidity
      </p>
      <div className={styles.container}>
        <div className={styles.imgWrapper}>
          <img src="./images/howtouse2.jpg" alt="connect wallet" />
        </div>
      </div>
      <p>
        For borrowing ehter, user must click on <span>Select a nft</span> button
        and select a owned NFT. after that user must select a liquidity provider
        and sign a contract. this contract is between the lender and the NFT
        owner
      </p>
      <div className={styles.container}>
        <div className={styles.imgWrapper}>
          <img src="./images/howtouse3.jpg" alt="connect wallet" />
        </div>
      </div>
      <p>
        The last step user must change the ownership of the NFT in order to get
        the funds . for the that user can click on the <span>get fund</span>{" "}
        button in the <span>DashBoard</span> section
      </p>
    </div>
  );
}

export default HowToUsePage;
