// CSS
import "./config/style/dark.scss";
import "./config/style/base.scss";

// React
import { useContext, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Context
import { DarkModeContext } from "./config/context/darkModeContext";

// Redux
import { verifyUser } from "./config/store/slices/authSlice";

// UI
import { ToastContainer } from "react-toastify";
import NotificationsListener from "./components/navbar/notifications/NotificationsListener";

// Pages
import Login from "./pages/auth/Login";
import Landing from "./pages/landing/Landing";
import RegisterSchool from "./pages/school/RegisterSchool";
import AdminRoutes from "./config/routes/AdminRoutes";
import FacultyRoutes from "./config/routes/FacultyRoutes";
import StudentRoutes from "./config/routes/StudentRoutes";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const dispatch = useDispatch();

  const { user, initialized } = useSelector(state => state.auth);

  // 🔑 Verify auth ONCE
  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  if (!initialized) return null; // or Loader

  const LoggedIn = ({ children }) => {
    if (user) {
      return <Navigate to={`/${user.role}`} />;
    }
    return children;
  };

  return (
    <>
      <ToastContainer theme={darkMode ? "dark" : "light"} />
      {user && <NotificationsListener />}

      <div className={darkMode ? "app dark" : "app"}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoggedIn><Landing /></LoggedIn>} />
            <Route path="/adminLogin" element={<LoggedIn><Login type="Admin" /></LoggedIn>} />
            <Route path="/facultyLogin" element={<LoggedIn><Login type="Faculty" /></LoggedIn>} />
            <Route path="/studentLogin" element={<LoggedIn><Login type="Student" /></LoggedIn>} />

            <Route path="/registerSchool" element={<RegisterSchool />} />

            <Route path="/resetPassword/student/:token" element={<ResetPassword type="student" />} />
            <Route path="/resetPassword/faculty/:token" element={<ResetPassword type="faculty" />} />

            {/* Protected Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/faculty/*" element={<FacultyRoutes />} />
            <Route path="/student/*" element={<StudentRoutes />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
