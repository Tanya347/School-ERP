import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInterceptor from "../../shared/axiosInterceptor";
import { getSingleData } from "../../endpoints/get";

export const fetchStudentProfile = createAsyncThunk(
  "student/fetchProfile",
  async (studentId, { rejectWithValue }) => {
    try {
      const res = await axiosInterceptor.get(
        getSingleData(studentId, "students")
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const studentSlice = createSlice({
  name: "student",
  initialState: {
    profile: null,
    loading: false,
    error: null
  },
  reducers: {
    clearStudent: state => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchStudentProfile.pending, state => {
        state.loading = true;
      })
      .addCase(fetchStudentProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchStudentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearStudent } = studentSlice.actions;
export default studentSlice.reducer;