import { createSlice } from "@reduxjs/toolkit";
import { fetchAllProductsAsync, fetchProductByIdAsync } from "./productThunks";

const initialState = {
  products: [],
  isFetching: false,
  error: false,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetProductSlice: (state) => {
      state.products = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProductsAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(fetchProductByIdAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products = action.payload;
      })
      .addCase(fetchProductByIdAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const { resetProductSlice } = productSlice.actions;

export default productSlice.reducer;
