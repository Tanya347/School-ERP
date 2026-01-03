import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getUpdateURL } from "../../config/endpoints/get";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (user, { rejectWithValue }) => {
    try {
      const url = getUpdateURL(user);

      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}${url}`,
        { withCredentials: true }
      );

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
