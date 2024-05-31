import { createSlice } from "@reduxjs/toolkit";
import { getOrdersAsync, addOrderAsync } from "./orderThunks";

const initialState = {
  orders: [],
  currentOrder: null,
  isFetching: false,
  error: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrderSlice: (state) => {
      state.orders = [];
      state.currentOrder = null;
    },
    currentOrderSlice: (state, action) => {
      state.currentOrder = action.payload;
    },
    resetcurrentOrderSlice: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(getOrdersAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(addOrderAsync.pending, (state) => {
        state.isFetching = true;
        state.error = false;
      })
      .addCase(addOrderAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(addOrderAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const { resetOrderSlice, currentOrderSlice, resetcurrentOrderSlice } =
  orderSlice.actions;

export default orderSlice.reducer;
