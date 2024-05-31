import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../../utils/requestMethods";

export const getCartAsync = createAsyncThunk("cart/getCart", async (userId) => {
  const response = await userRequest.get(`/carts/find/${userId}`);
  return response.data;
});

export const deleteProductFromCartAsync = createAsyncThunk(
  "cart/deleteProductFromCart",
  async ({ userId, itemId }) => {
    const response = await userRequest.delete(
      `/carts/${userId}/products/${itemId}`
    );
    return response.data;
  }
);

export const addOrUpdateCartAsync = createAsyncThunk(
  "cart/addOrUpdateCart",
  async ({ userId, productId, title, img, quantity, size, color, price }) => {
    const response = await userRequest.post(`/carts`, {
      userId,
      productId,
      title,
      img,
      quantity,
      size,
      color,
      price,
    });
    return response.data;
  }
);

export const updateProductQuantityInCartAsync = createAsyncThunk(
  "cart/updateProductQuantityInCart",
  async ({ userId, itemId, newQuantity }) => {
    const response = await userRequest.patch(
      `/carts/${userId}/updateProductQuantity`,
      {
        itemId,
        newQuantity,
      }
    );
    return response.data;
  }
);

export const deleteCartAsync = createAsyncThunk(
  "cart/deleteCart",
  async (userId) => {
    const response = await userRequest.delete(`/carts/${userId}`);
    return userId;
  }
);
