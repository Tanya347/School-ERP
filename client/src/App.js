// CSS
import "./config/style/dark.scss";
import "./config/style/base.scss";

// React Stuff
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DarkModeContext } from "./config/context/darkModeContext";

// Common Pages
import Login from "./pages/login/Login";
import Landing from "./pages/Landing/Landing";
import AdminRoutes from "./config/routes/AdminRoutes";
import FacultyRoutes from "./config/routes/FacultyRoutes";
import StudentRoutes from "./config/routes/StudentRoutes";
import { useAuth } from "./config/context/AuthContext";
import { ToastContainer } from "react-toastify";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const { user } = useAuth();

  const LoggedIn = ({ children }) => {
    if (user) {
      return <Navigate to={`/${user.role}`}/>
    } else return children;
  };

  return (
    // darkmode context
    <>
      <ToastContainer />
      <div className={darkMode ? "app dark" : "app"}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoggedIn><Landing /></LoggedIn>} />
            <Route path="/adminLogin" element={<LoggedIn><Login type="Admin" /></LoggedIn>} />
            <Route path="/facultyLogin" element={<LoggedIn><Login type="Faculty" /></LoggedIn>} />
            <Route path="/studentLogin" element={<LoggedIn><Login type="Student" /></LoggedIn>} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* Faculty Routes */}
            <Route path="/faculty/*" element={<FacultyRoutes />} />

            {/* Student Routes */}
            <Route path="/student/*" element={<StudentRoutes />} />


          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
