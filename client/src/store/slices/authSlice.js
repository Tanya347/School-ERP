import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { logoutEndpoint, validateEndpoint } from "../../config/endpoints/post";

export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        validateEndpoint,
        {},
        { withCredentials: true }
      );
      return res.data.user;
    } catch (err) {
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async () => {
    await axios.post(
      logoutEndpoint(),
      {},
      { withCredentials: true }
    );
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    initialized: false // 🔑 critical
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(verifyUser.pending, state => {
        state.loading = true;
      })
      .addCase(verifyUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(verifyUser.rejected, state => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.user = null;
      });
  }
});

export const { loginSuccess } = authSlice.actions;
export default authSlice.reducer;
