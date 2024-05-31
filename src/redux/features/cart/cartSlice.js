import { createSlice } from "@reduxjs/toolkit";
import {
  getCartAsync,
  deleteProductFromCartAsync,
  addOrUpdateCartAsync,
  updateProductQuantityInCartAsync,
  deleteCartAsync,
} from "./cartThunks";

const initialState = {
  products: [],
  quantity: 0,
  total: 0,
  isFetching: false,
  error: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCartSlice: (state) => {
      state.products = [];
      state.quantity = 0;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCartAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getCartAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload.success) {
          state.products = action.payload.cart.products;
          state.quantity = action.payload.cart.products.length;
          state.total = action.payload.cart.totalAmount;
        }
      })
      .addCase(getCartAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(deleteProductFromCartAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(deleteProductFromCartAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload.message !== "Cart deleted") {
          state.products = action.payload.products;
          state.quantity = action.payload.products.length;
          state.total = action.payload.totalAmount;
        } else {
          state.products = [];
          state.quantity = 0;
          state.total = 0;
        }
      })
      .addCase(deleteProductFromCartAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(addOrUpdateCartAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(addOrUpdateCartAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products = action.payload.products;
        state.quantity = action.payload.products.length;
        state.total = action.payload.totalAmount;
      })
      .addCase(addOrUpdateCartAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(updateProductQuantityInCartAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(updateProductQuantityInCartAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products = action.payload.cart.products;
        state.quantity = action.payload.cart.products.length;
        state.total = action.payload.cart.totalAmount;
      })
      .addCase(updateProductQuantityInCartAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(deleteCartAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(deleteCartAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.products = [];
        state.quantity = 0;
        state.total = 0;
      })
      .addCase(deleteCartAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const { resetCartSlice } = cartSlice.actions;

export default cartSlice.reducer;
