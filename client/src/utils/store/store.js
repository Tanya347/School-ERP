import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notificationReducer from "./slices/notificationSlice";
import schoolReducer from "./slices/schoolSlice";
import adminReducer from "./slices/adminSlice";
import facultyReducer from "./slices/facultySlice";
import studentReducer from "./slices/studentSlice";

import { injectStore } from "../shared/axiosInterceptor";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    school: schoolReducer,
    admin: adminReducer,
    faculty: facultyReducer,
    student: studentReducer
  }
});

injectStore(store);
