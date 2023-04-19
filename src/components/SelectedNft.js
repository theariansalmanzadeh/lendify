import React, { useState } from "react";
import { setNftLenderContract } from "../store/contractNftSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import loadingStyle from "../styles/sass/components/loadingCom.module.scss";
import styles from "../styles/sass/layout/SelectedNft.module.scss";
import { ethers } from "ethers";
import { getNftData } from "../utils/helper";

function SelectedNft() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const lenderAddress = useSelector(({ web3 }) => web3.accountAddress);
  const signer = useSelector(({ web3 }) => web3.signer);
  const provider = useSelector(({ web3 }) => web3.provider);

  const selectedNft = useSelector(
    ({ contractInfo }) => contractInfo.selectedNft
  );
  const isLender = useSelector(
    ({ contractInfo }) => contractInfo.isLenderSelected
  );
  const lpIndex = useSelector(({ contractInfo }) => contractInfo.lpIndex);
  const amount = useSelector(
    ({ contractInfo }) => contractInfo.ethAmountLending
  );
  const factoryContract = useSelector(
    ({ contractInfo }) => contractInfo.contractQueen
  );

  // console.log(factoryContract);

  const signContractHandler = async () => {
    const nonce = await signer.getTransactionCount();
    console.log(nonce);

    try {
      setIsLoading(true);

      const res = await factoryContract.createContract(
        lpIndex,
        selectedNft.nftContract,
        selectedNft.tokenId,
        amount
      );

      await res.wait();
      console.log(res);
      const contractAddress = await factoryContract.contractInfoNftLender(
        lenderAddress
      );
      console.log(contractAddress);

      // const amountInWei = ethers.utils.parseEther(amount);
      console.log(amount, selectedNft.nftContract, selectedNft.tokenId);

      const contractSigned = await factoryContract.contractInfoNftLender(
        lenderAddress
      );
      console.log(contractSigned);
      dispatch(setNftLenderContract(contractSigned));
      navigate("/platform/dashboard");
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      alert("liquidity provider can not use the platform");
    }
  };

  return (
    <div className={styles.selectLenderSection}>
      <div className={styles.nftImgWrapper}>
        <img src={selectedNft.imgUrl} alt="nft" />
      </div>
      <div className={styles.nftDetails}>
        <p>
          current Owner : <span>{selectedNft.ownerAddress}</span>
        </p>
        <p>
          token ID : <span>{selectedNft.tokenId}</span>
        </p>
        <p>
          nft Contract : <span>{selectedNft.nftContract}</span>
        </p>
      </div>
      <div className={styles.signContractWrapper}>
        <button
          className={
            isLender ? `${styles.signContract}` : ` ${styles.deactive}`
          }
          disabled={isLender ? false : true}
          onClick={signContractHandler}
        >
          Sign Contract
        </button>
        {isLoading && (
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
        )}
      </div>
    </div>
  );
}

export default SelectedNft;
