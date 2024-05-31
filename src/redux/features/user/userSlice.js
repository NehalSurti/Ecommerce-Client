import { createSlice } from "@reduxjs/toolkit";
import { loginAsync, registerAsync } from "./userThunks";

const initialState = {
  currentUser: null,
  isFetching: false,
  error: false,
  registerNewUser: false,
  registerError: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      localStorage.removeItem("rootReactApp");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isFetching = true;
        state.registerError = false;
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.registerNewUser = action.payload;
        state.registerError = false;
      })
      .addCase(registerAsync.rejected, (state) => {
        state.isFetching = false;
        state.registerError = true;
      })
      .addCase(loginAsync.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentUser = action.payload;
        state.error = false;
      })
      .addCase(loginAsync.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
