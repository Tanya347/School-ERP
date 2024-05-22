// CSS
import "./style/dark.scss";
import "./style/base.scss";

// React Stuff
import { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { DarkModeContext } from "./context/darkModeContext";

// Common Pages
import Login from "./pages/login/Login";
import Landing from "./pages/Landing/Landing";
import AdminRoutes from "./source/routes/AdminRoutes";
import FacultyRoutes from "./source/routes/FacultyRoutes";
import StudentRoutes from "./source/routes/StudentRoutes";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  const { user } = useContext(AuthContext);

  const LoggedIn = ({ children }) => {
    if (user) {
      if (user.isAdmin) return <Navigate to="/admin" />;
      else if (user.isFaculty) return <Navigate to="/faculty" />;
      else if (user.isStudent) return <Navigate to="/student" />;
    } else return children;
  };

  return (
    // darkmode context
    <div className={darkMode ? "app dark" : "app"}>
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<LoggedIn><Landing /></LoggedIn>} />
          <Route path="/adminLogin" element={<LoggedIn><Login type="Admin" /></LoggedIn>} />
          <Route path="/facultyLogin" element={<LoggedIn><Login type="Faculty" /></LoggedIn>} />
          <Route path="/studentLogin" element={<LoggedIn><Login type="Student" /></LoggedIn>} />

          {/* Admin Routes */}
          {user?.isAdmin && <Route path="/*" element={<AdminRoutes />} />}

          {/* Faculty Routes */}
          {user?.isFaculty && <Route path="/*" element={<FacultyRoutes />} />}

          {/* Student Routes */}
          {user?.isStudent && <Route path="/*" element={<StudentRoutes />} />}


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
