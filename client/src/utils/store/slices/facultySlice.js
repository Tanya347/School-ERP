import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInterceptor from "../../shared/axiosInterceptor";
import { getFacultyData } from "../../endpoints/get";

export const fetchFacultyCourses = createAsyncThunk(
  "faculty/fetchCourses",
  async (facultyId, { rejectWithValue }) => {
    try {
      const res = await axiosInterceptor.get(
        getFacultyData(facultyId, "courses")
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchFacultyClasses = createAsyncThunk(
  "faculty/fetchClasses",
  async (facultyId, { rejectWithValue }) => {
    try {
      const res = await axiosInterceptor.get(
         getFacultyData(facultyId, "classes")
      );
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const facultySlice = createSlice({
  name: "faculty",
  initialState: {
    courses: [],
    classes: [],
    loading: false,
    error: null
  },
  reducers: {
    clearFaculty: state => {
      state.courses = [];
      state.classes = [];
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFacultyCourses.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFacultyCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.loading = false;
      })
      .addCase(fetchFacultyCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFacultyClasses.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFacultyClasses.fulfilled, (state, action) => {
        state.classes = action.payload;
        state.loading = false;
      })
      .addCase(fetchFacultyClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearFaculty } = facultySlice.actions;
export default facultySlice.reducer;