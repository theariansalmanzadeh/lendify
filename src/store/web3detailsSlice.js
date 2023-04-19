import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  provider: {},
  netWorkName: "",
  netWorkId: 0x00,
  accountAddress: "",
  signer: {},
};

export const web3Slice = createSlice({
  name: "providers",
  initialState,
  reducers: {
    setProvider(state, action) {
      state.provider = action.payload;
    },

    setNetWork(state, action) {
      state.netWorkId = action.payload.netWorkId;
      state.netWorkName = action.payload.netWorkName;
    },
    setAccountAddress(state, action) {
      state.accountAddress = action.payload[0];
      console.log(state.accountAddress);
    },
    setSigner(state, action) {
      state.signer = action.payload;
      console.log(state.signer);
    },
  },
});

export const { setProvider, setAccountAddress, setNetWork, setSigner } =
  web3Slice.actions;
