import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify"
import axios from "axios"
import { checkSuccess } from "../../shared/commons";

import { logoutEndpoint, validateEndpoint } from "../../endpoints/post";

const clearAllToasts = () => {
  toast.dismiss();
};

export const verifyUser = createAsyncThunk(
  "auth/verify",
  async (_, { rejectWithValue }) => {
    try {
      // validateEndpoint already returns full URL with base
      const res = await axios.post(
        validateEndpoint(),
        {},
        { withCredentials: true },
      );
      return res.data.user;
    } catch (err) {
      // Clear toasts on auth failure to prevent stale messages
      clearAllToasts();
      return rejectWithValue(null);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    // Clear any existing toasts before logging out
    clearAllToasts();
    try {
      // logoutEndpoint already returns full URL with base
      const res = await axios.post(
        logoutEndpoint(),
        {},
        { withCredentials: true },
      );
      if(checkSuccess(res.data.status)) {
        toast.success("Successfully logged out");
      }
    } catch (err) {
      toast.error(`Error while logging out: ${err.response?.data?.message}`);
      console.error();
    }
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
