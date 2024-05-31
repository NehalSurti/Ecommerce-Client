import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../../utils/requestMethods";

export const getWishlistAsync = createAsyncThunk(
  "wishlist/getWishlist",
  async (userId) => {
    const response = await userRequest.get(`/wishlist/${userId}`);
    return response.data;
  }
);

export const deleteProductFromWishlistAsync = createAsyncThunk(
  "wishlist/deleteProductFromWishlist",
  async ({ userId, productId }) => {
    const response = await userRequest.delete(
      `/wishlist/${userId}/products/${productId}`
    );
    return { userId, productId };
  }
);

export const addOrUpdateWishlistAsync = createAsyncThunk(
  "wishlist/addOrUpdateWishlist",
  async ({ userId, productId, title, img, price }) => {
    const response = await userRequest.post(`/wishlist`, {
      userId,
      productId,
      title,
      img,
      price,
    });
    return response.data;
  }
);
