import { web3Slice } from "./web3detailsSlice";
import { configureStore } from "@reduxjs/toolkit";
import { contractNftSlice } from "./contractNftSlice";

export const store = configureStore({
  reducer: { web3: web3Slice.reducer, contractInfo: contractNftSlice.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
