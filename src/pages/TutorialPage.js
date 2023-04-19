import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/sass/pages/tutorial.module.scss";
import { FaExchangeAlt } from "react-icons/fa";
import { BsSafe2Fill } from "react-icons/bs";
import timer from "../Svgs/time-left-svgrepo-com.svg";

function TutorialPage() {
  return (
    <React.Fragment>
      <div className={styles.TutorialPage}>
        <h3>Whats Lendify</h3>
        <div className={styles.infoWrapper}>
          <div className={styles.card}>
            <p>
              lendify is a platform for lending your NFT and borrowing Native
              Ether coin instead. the amount of coins received, depends on the
              value of the NFT it self.
            </p>
          </div>
          <div className={styles.imgWrapper}>
            <img src="./images/nft2.jfif" alt="a nft" />
          </div>
        </div>
        <div className={styles.infoWrapper}>
          <div className={styles.card}>
            <p>
              there is a 15% tolorance in the ratio of amount of received and
              the non fongiable token it self. in case of borrowing Ether there
              is intrest rate of 10% return. NFT owners must consider this
              before signing the contract.
            </p>
            <div className={styles.iconWrapper}>
              <FaExchangeAlt className={styles.icon} />
              <BsSafe2Fill className={styles.icon} />
            </div>
          </div>
        </div>
        <div className={styles.infoWrapper}>
          <div className={styles.card}>
            <p>
              all contracts made by the lendify platform has a fix dealine of 60
              days, but the NFT owner is able to pay the ether amount and the
              intrest rate before the deadline. in case the nft owner doesnt pay
              the amount must payed the NFT belongs to the lender after the
              deadline.currently we accept all NFT contract ,but when using main
              net only specific contracts are accepted
            </p>
          </div>
          <div className={styles.imgWrapper}>
            <img src={timer} alt="chornometer" />
          </div>
        </div>
      </div>
      <div className={styles.detailsSection}>
        <h3>Lendify Smart Contracts</h3>
        <p>
          factory contract address :{" "}
          <Link to="#">
            <span> 0x73cD2093ff33460F10EC72E80386E297E866C7cA</span>
          </Link>
        </p>
      </div>
    </React.Fragment>
  );
}

export default TutorialPage;
