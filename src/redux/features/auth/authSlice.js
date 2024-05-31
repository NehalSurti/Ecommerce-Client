import { createSlice } from "@reduxjs/toolkit";
import { checkAuthAsync } from "./authThunks";

const initialState = {
  status: "idle",
  error: null,
  userChecked: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.userChecked = true;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.status = "idle";
        state.userChecked = false;
      });
  },
});

export default authSlice.reducer;
