import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setNftLenderContract,
  setFactoryContract,
  setEtherLenderAddress,
  selectNft,
} from "../store/contractNftSlice";
import { Outlet } from "react-router";
import ChainSupport from "../components/chainSupport";
import { ethers } from "ethers";
import { createContract } from "../utils/helper";
import { contractAddress, factoryContractAbi } from "../utils/contractInfo";

function BorrowPage() {
  const dispatch = useDispatch();

  const provider = useSelector((state) => state.web3.provider);
  const accountAddress = useSelector((state) => state.web3.accountAddress);
  const signer = useSelector((state) => state.web3.signer);

  useEffect(() => {
    if (!accountAddress) return;
    console.log("ok");
    const contract = new ethers.Contract(
      contractAddress,
      factoryContractAbi,
      provider
    );
    (async () => {
      const nweContract = contract.connect(signer);

      const res = await nweContract.contractInfoNftLender(accountAddress);

      if (Number(res) !== 0) {
        const childContract = createContract(res, provider);
        const contractDetials = await childContract
          .connect(signer)
          .contractDetails();
        console.log(contractDetials);

        dispatch(setEtherLenderAddress(contractDetials[1]));
        dispatch(
          selectNft({
            ownerAddress: "",
            nftContract: contractDetials[0],
            tokenId: contractDetials[2],
            imgUrl: "",
          })
        );
      }

      dispatch(setNftLenderContract(res));
      dispatch(setFactoryContract(nweContract));
    })();
  }, [dispatch, signer, provider]);

  return (
    <React.Fragment>
      <ChainSupport />
      <Outlet />
    </React.Fragment>
  );
}

export default BorrowPage;
