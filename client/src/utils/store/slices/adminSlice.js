import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInterceptor from "../../shared/axiosInterceptor";
import { getClasses } from "../../endpoints/get";

// Fetch all classes for admin
export const fetchAdminClasses = createAsyncThunk(
  "admin/fetchClasses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInterceptor.get(getClasses);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    classes: [],
    loadingClasses: false,
    error: null
  },
  reducers: {
    clearAdmin: state => {
      state.classes = [];
      state.loadingClasses = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminClasses.pending, state => {
        state.loadingClasses = true;
      })
      .addCase(fetchAdminClasses.fulfilled, (state, action) => {
        state.classes = action.payload;
        state.loadingClasses = false;
      })
      .addCase(fetchAdminClasses.rejected, (state, action) => {
        state.loadingClasses = false;
        state.error = action.payload;
      });
  }
});

export const { clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;