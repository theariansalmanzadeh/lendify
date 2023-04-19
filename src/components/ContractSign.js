import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
// import { nftContractAddress } from "../utils/contractInfo";
import {
  createContract,
  timeStampToDay,
  createNftContract,
  getNftImg,
  getImgNftByContract,
} from "../utils/helper";
import { useSelector } from "react-redux";
import styles from "../styles/sass/layout/contractSign.module.scss";
import LoadingSignedContract from "./LoadingSignedContract.js";

function ContractSign({ setLoading }) {
  const [contractInfos, setContractInfos] = useState({
    address: "",
    lenderAddress: "",
    nftContractAddress: "",
    tokenId: "",
  });
  const [isContract, setIsContract] = useState(false);
  const [isNftOwner, setIsNftOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [time, setTime] = useState({ now: 0, deadline: 0 });

  const lenderAddress = useSelector(({ web3 }) => web3.accountAddress);
  const factoryContract = useSelector(
    ({ contractInfo }) => contractInfo.contractQueen
  );

  const provider = useSelector(({ web3 }) => web3.provider);
  const signer = useSelector(({ web3 }) => web3.signer);
  const nftOwnerAddress = useSelector(({ web3 }) => web3.accountAddress);

  const nftTransferHandler = async () => {
    setLoading(true);
    const contractAddress = await factoryContract.contractInfoNftLender(
      lenderAddress
    );
    const nftContractAddress = contractInfos.nftContractAddress;
    const nftContract = createNftContract(nftContractAddress, provider);

    const res = await nftContract
      .connect(signer)
      .transferFrom(nftOwnerAddress, contractAddress, contractInfos.tokenId);

    await res.wait();

    //get the amount of ETH
    const contract = createContract(contractAddress, provider);
    const res2 = await contract.connect(signer).fundNftOwner();

    await res2.wait();

    setLoading(false);
    setRefresh(true);
  };

  const refundContractHandler = async () => {
    setLoading(true);
    console.log("ok");
    const contractAddress = await factoryContract.contractInfoNftLender(
      lenderAddress
    );
    const contract = createContract(contractAddress, provider);

    console.log(contractInfos.nftContractAddress);

    let initialValue = await contract.connect(signer).valueOfContract();

    initialValue = parseInt(initialValue, 10);
    let newValue = String(initialValue + initialValue * 0.1);

    console.log(initialValue, newValue);

    const res = await contract.connect(signer).refundLoan({
      value: newValue,
    });
    await res.wait();

    setLoading(false);
    setRefresh(true);
  };

  useEffect(() => {
    if (refresh !== true) return;
    (async () => {
      setIsLoading(true);
      const contractAddress = await factoryContract.contractInfoNftLender(
        lenderAddress
      );
      setIsContract(Number(contractAddress) !== 0 ? true : false);

      if (Number(contractAddress) === 0) return;

      try {
        const contract = createContract(contractAddress, provider);
        const contractDetails = await contract
          .connect(signer)
          .contractDetails();

        const times = await contract.connect(signer).timeRemaining();
        setTime({ now: times[0], deadline: times[1] });

        const nftContract = createNftContract(contractDetails[0], provider);
        const ownerNft = await nftContract
          .connect(signer)
          .ownerOf(contractDetails[2]);
        setIsNftOwner(ownerNft !== lenderAddress ? true : false);

        const imgUrl = await getImgNftByContract(
          contractDetails[0],
          contractDetails[2]
        );

        setContractInfos({
          address: contractAddress,
          lenderAddress: contractDetails[1],
          nftContractAddress: contractDetails[0],
          tokenId: String(contractDetails[2]),
          img: imgUrl,
        });
        setIsLoading(false);
      } catch (e) {
        console.log(e);
        setIsLoading(false);
      }
    })();
    setRefresh(false);
  }, [refresh]);

  if (!isContract)
    return (
      <div className={styles.contractDetails}>
        <p>No Contract signed</p>
      </div>
    );
  else if (isContract) {
    return (
      <div className={styles.contractSigned}>
        {isLoading && <LoadingSignedContract />}
        <span>Contract info :</span>
        <p>Contract Address : {contractInfos.address}</p>
        <p>Lender Address : {contractInfos.lenderAddress}</p>
        <p>NFT :</p>
        <div>
          <div className={styles.nftWrapper}>
            {contractInfos.img && (
              <img src={contractInfos.img} alt="nft borrowed" />
            )}
          </div>
          <p>
            NFT contract:{" "}
            {Number(contractInfos.nftContractAddress) === 0
              ? "-"
              : contractInfos.nftContractAddress}
          </p>
          {contractInfos.tokenId !== "" && (
            <p>Token ID : {contractInfos.tokenId}</p>
          )}
        </div>
        <button
          disabled={isNftOwner}
          onClick={nftTransferHandler}
          className={!isNftOwner ? styles.nftTransfer : styles.deactive}
        >
          transfer Nft
        </button>
        <div className={styles.refundContract}>
          <button
            onClick={refundContractHandler}
            disabled={!isNftOwner}
            className={isNftOwner ? "" : styles.deactive}
          >
            Pay fund Back
          </button>
          <p>
            Time remained :
            <span>{timeStampToDay(time.now, time.deadline)} days</span>
          </p>
        </div>
      </div>
    );
  }
}

export default ContractSign;
