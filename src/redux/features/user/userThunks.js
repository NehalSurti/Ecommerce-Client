import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest } from "../../../utils/requestMethods";

export const loginAsync = createAsyncThunk("user/login", async (user) => {
  const response = await publicRequest.post("/auth/login", user);
  return response.data;
});

export const registerAsync = createAsyncThunk("user/register", async (user) => {
  const response = await publicRequest.post("/auth/register", user);
  return response.data ? true : false;
});
