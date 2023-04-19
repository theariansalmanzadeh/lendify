import { ethers } from "ethers";
// import Moralis from "moralis";
import { childContract } from "../utils/contractInfo";
import { nftAbi } from "../utils/generalAbi.js";

export const displayAccount = (account) => {
  const newAddress = account.slice(0, 5) + "..." + account.slice(-2);
  return newAddress;
};

export const renameChain = (chainName) => {
  const newName = chainName[0].toUpperCase() + chainName.slice(1);
  return newName;
};

export const getAllNFTs = async (accountAddress) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": "ch6GbLw1oqUEtOYeWF8NDzEjU5oEQmYW",
    },
  };

  try {
    const res = await fetch(
      `https://api.blockspan.com/v1/nfts/owner/${accountAddress}?chain=eth-goerli&token_type=erc721&page_size=10`,
      options
    );
    const allNFTs = await res.json();
    console.log(allNFTs);
    if (allNFTs.errors) throw new Error("no Nfts found");
    return allNFTs.results;
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getNftData = async (contractAddress, tokenId) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-API-KEY": "ch6GbLw1oqUEtOYeWF8NDzEjU5oEQmYW",
    },
  };
  console.log(contractAddress, tokenId);
  const res = await fetch(
    `https://api.blockspan.com/v1/nfts/contract/${contractAddress}/token/${tokenId}?chain=eth-goerli`,
    options
  );
  let NFTs = await res.json();
  console.log(NFTs);
  if (NFTs.cached_images !== null) {
    console.log("ok");
    return NFTs;
  }

  const img = await getNftImg(NFTs);
  console.log(img);

  if (img === undefined) return NFTs;

  NFTs = { ...NFTs, image: img };

  return NFTs;
};

export const getNftImg = async (NFTs) => {
  const img = await getMetaData(NFTs.uri);

  // console.log(img);

  return img;
};

export const getMetaData = async (uri) => {
  if (!uri.includes("https://")) return;
  try {
    const res = await fetch(uri);
    const metaData = await res.json();
    console.log(metaData);
    return metaData.image;
  } catch (e) {
    console.log(e);
  }
};

export const getImgUri = async (uri) => {
  try {
    const res = await fetch(uri);
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const filterNftByPrice = (nftCollection) => {
  let acceptedNfts = nftCollection.filter(
    (nft) => nft.image !== undefined || nft.cached_images !== null
  );

  if (acceptedNfts.length === 0) return;

  acceptedNfts = acceptedNfts.map((nft) => {
    nft.image =
      nft.cached_images !== null
        ? (nft.image = nft.cached_images.original)
        : nft.image;
    return nft;
  });
  return acceptedNfts;
};

export const createContract = (address, provider) => {
  const contract = new ethers.Contract(address, childContract, provider);

  return contract;
};

export const createNftContract = (address, provider) => {
  const contract = new ethers.Contract(address, nftAbi, provider);

  return contract;
};

export const timeStampToDay = (now, deadline) => {
  return parseInt((Number(deadline) - Number(now)) / (60 * 60 * 24));
};
