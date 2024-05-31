import { createSlice } from "@reduxjs/toolkit";
import {
  getWishlistAsync,
  deleteProductFromWishlistAsync,
  addOrUpdateWishlistAsync,
} from "./wishlistThunks";

const initialState = {
  wishlistProducts: [],
  wishlistQuantity: 0,
  isFetching: false,
  error: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    resetWishlist: (state) => {
      state.wishlistProducts = [];
      state.wishlistQuantity = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWishlistAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getWishlistAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload.success) {
          state.wishlistProducts = action.payload.wishlist.products;
          state.wishlistQuantity = action.payload.wishlist.totalQuantity;
        }
      })
      .addCase(getWishlistAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(deleteProductFromWishlistAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(deleteProductFromWishlistAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.wishlistProducts.splice(
          state.wishlistProducts.findIndex(
            (item) => item.productId === action.payload.productId
          ),
          1
        );
        state.wishlistQuantity -= 1;
      })
      .addCase(deleteProductFromWishlistAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(addOrUpdateWishlistAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(addOrUpdateWishlistAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.wishlistProducts = action.payload.products;
        state.wishlistQuantity = action.payload.totalQuantity;
      })
      .addCase(addOrUpdateWishlistAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const { resetWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
