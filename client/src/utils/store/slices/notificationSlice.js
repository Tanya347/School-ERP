import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUpdateURL } from "../../endpoints/get";
import axiosInterceptor from "../../shared/axiosInterceptor";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (user, { rejectWithValue }) => {
    try {

      const res = await axiosInterceptor.get(getUpdateURL(user));

      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    fetched: false,
    loading: false
  },
  reducers: {
    clearNotifications: state => {
      state.list = [];
      state.fetched = false;
      state.loading = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload;
        state.fetched = true;
        state.loading = false;
      });
  }
});

export const { clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
