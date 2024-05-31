import { createAsyncThunk } from "@reduxjs/toolkit";
import { publicRequest } from "../../../utils/requestMethods";

export const checkAuthAsync = createAsyncThunk(
  "auth/checkAuth",
  async ({ TOKEN, id }) => {
    try {
      const response = await publicRequest.get(`/auth/tokenVerify/${id}`, {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      return response.data.status;
    } catch (err) {
      console.log(err);
    }
  }
);
