import { createAsyncThunk } from "@reduxjs/toolkit";
import { userRequest } from "../../../utils/requestMethods";

export const getOrdersAsync = createAsyncThunk(
  "order/getOrders",
  async (userId) => {
    const response = await userRequest.get(`/orders/find/${userId}`);
    return response.data;
  }
);

export const addOrderAsync = createAsyncThunk(
  "order/addOrder",
  async (order) => {
    const response = await userRequest.post(`/orders`, order);
    return response.data;
  }
);
