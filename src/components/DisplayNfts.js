import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/sass/pages/lending.module.scss";
import Loading from "./Loading";
import SelectLender from "./SelectLender.js";
import ChainSupport from "./chainSupport";
import { selectNft } from "../store/contractNftSlice";
import SelectedNft from "./SelectedNft.js";
import {
  getAllNFTs,
  getNftData,
  filterNftByPrice,
  getImgUri,
} from "../utils/helper";

function DisplayNfts() {
  const [isNftsOwned, setIsNftsOwned] = useState(null);
  const [nftCollection, setNftCollection] = useState([]);
  const [noNfts, setNoNfts] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectLender, setIsSelectLender] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(false);

  const { accountAddress } = useSelector(({ web3 }) => web3);
  const Iscontract = useSelector(
    ({ contractInfo }) => contractInfo.contractLenderAddress
  );

  const dispatch = useDispatch();

  const selectLenderHanlder = (event) => {
    const target = event.target;
    const elem = target.closest("div");

    if (!elem.classList.contains("nft")) return;

    const indx = elem.getAttribute("data-set");
    console.log(nftCollection[indx]);

    const nftSelected = {
      ownerAddress: nftCollection[indx].current_owners[0].address,
      nftContract: nftCollection[indx].contract_address,
      tokenId: nftCollection[indx].id,
      imgUrl: nftCollection[indx].image,
    };

    dispatch(selectNft(nftSelected));

    setIsSelectLender(true);
  };

  const getNftHandler = async () => {
    setIsLoading(true);

    try {
      const Nfts = await getAllNFTs(accountAddress);
      // console.log(Nfts);
      if (Nfts.length === 0) {
        setIsNftsOwned(false);
        setIsLoading(false);
        setNoNfts(true);
        return;
      }

      const nftDetails = await Promise.all([
        ...Nfts.map((nft) => getNftData(nft.contract_address, nft.id)),
      ]);

      const nftsAccepted = filterNftByPrice(nftDetails);
      console.log(nftsAccepted);

      if (nftsAccepted.length === 0) {
        setIsNftsOwned(false);
        setIsLoading(false);
        setNoNfts(true);
        return;
      }

      setIsNftsOwned(true);
      setIsLoading(false);

      nftsAccepted.length >= 6
        ? setNftCollection(nftsAccepted.slice(0, 6))
        : setNftCollection(nftsAccepted);
    } catch (e) {
      setIsNftsOwned(false);
      setIsLoading(false);
    }
  };

  // console.log(noNfts);

  return (
    <React.Fragment>
      <div className={styles.platform}>
        {isLoading && <Loading />}
        {Number(Iscontract) !== 0 && (
          <div className={styles.nftOwner}>
            <p className={styles.nftInUse}>
              currently in use, details in your Dashboard
            </p>
          </div>
        )}
        {Number(Iscontract) === 0 && isNftsOwned === null && (
          <div className={styles.nftOwner}>
            <button onClick={getNftHandler}>select a NFT</button>
          </div>
        )}
        {isNftsOwned === false && noNfts && (
          <div className={styles.nftOwner}>
            <div className={styles.notFound}>
              <p>No Proper NFT found</p>
              <button onClick={getNftHandler}>try again</button>
            </div>
          </div>
        )}
        {isNftsOwned === true &&
          nftCollection.length !== 0 &&
          isSelectLender === false && (
            <React.Fragment>
              <div className={styles.nftOwner}>
                <p className={styles.heading}>select one of your NFTs</p>
                <ul
                  onClick={selectLenderHanlder}
                  className={styles.nftCollection}
                >
                  {nftCollection.map((nft, indx) => {
                    return (
                      <li key={indx}>
                        <div className="nft" data-set={indx}>
                          {isImgLoading && (
                            <div className={styles.overlay}></div>
                          )}
                          {nft?.image && (
                            <img
                              src={nft.image}
                              alt="nft"
                              onLoad={() => {
                                setIsImgLoading(false);
                              }}
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </React.Fragment>
          )}
        {isNftsOwned === true && isSelectLender === true && (
          <div className={styles.nftSelectedSection}>
            <SelectedNft />
          </div>
        )}
        <div className={styles.liquidityProviders}>
          {isSelectLender && <SelectLender />}
        </div>
      </div>
    </React.Fragment>
  );
}

export default DisplayNfts;
