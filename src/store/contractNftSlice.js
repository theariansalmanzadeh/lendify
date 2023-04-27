import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedNft: {
    ownerAddress: "",
    nftContract: "",
    tokenId: "",
    imgUrl: "",
  },
  contractQueen: {},
  contractLenderAddress: "",
  lenderAddress: "",
  ethLenderAddress: "",
  isLenderSelected: false,
  contractProvider: null,
  contractTimeRemained: 0,
  lpIndex: -1,
  ethAmountLending: 0,
};

export const contractNftSlice = createSlice({
  name: "nftAndContract",
  initialState,
  reducers: {
    selectNft(state, action) {
      state.selectedNft.ownerAddress = action.payload.ownerAddress;
      state.selectedNft.nftContract = action.payload.nftContract;
      state.selectedNft.tokenId = action.payload.tokenId;
      state.selectedNft.imgUrl = action.payload.imgUrl;
    },
    setContractProvider(state, action) {
      state.contractProvider = action.payload;
    },
    setContractObject(state, action) {
      state.contract = action.payload;
    },
    selectLender(state, action) {
      state.isLenderSelected = action.payload;
    },
    setNftLenderContract(state, action) {
      state.contractLenderAddress = action.payload;
      console.log(action.payload);
    },
    setFactoryContract(state, action) {
      state.contractQueen = action.payload;
    },
    setNftLenderAddress(state, action) {
      state.lenderAddress = action.payload;
    },
    setIndexLp(state, action) {
      state.lpIndex = action.payload;
    },
    setEthAmount(state, action) {
      state.ethAmountLending = action.payload;
      console.log(state.ethAmountLending);
    },
    setEtherLenderAddress(state, action) {
      state.ethLenderAddress = action.payload;
    },
  },
});

export const {
  selectLender,
  selectNft,
  setContractProvider,
  setContractObject,
  setNftLenderContract,
  setFactoryContract,
  setNftLenderAddress,
  setIndexLp,
  setEthAmount,
  setEtherLenderAddress,
} = contractNftSlice.actions;
