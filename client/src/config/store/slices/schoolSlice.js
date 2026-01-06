import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInterceptor from "../../utils/axiosInterceptor";
import { getSchoolInfo } from "../../endpoints/get";

export const fetchSchoolInfo = createAsyncThunk(
  "school/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInterceptor.get(getSchoolInfo);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message
      );
    }
  }
);

const schoolSlice = createSlice({
  name: "school",
  initialState: {
    info: null,
    activeSession: null,
    loading: false,
    fetched: false,
    error: null
  },
  reducers: {
    clearSchool: state => {
      state.info = null;
      state.activeSession = null;
      state.loading = false;
      state.fetched = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSchoolInfo.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchoolInfo.fulfilled, (state, action) => {
        state.info = action.payload.school;
        state.activeSession = action.payload.activeSession;
        state.loading = false;
        state.fetched = true;
      })
      .addCase(fetchSchoolInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearSchool } = schoolSlice.actions;
export default schoolSlice.reducer;