import React, { useEffect, useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/AdminDashboard";
import MyJobs from "./pages/MyJobs";
import PostJob from "./pages/PostJob";
import Announcement from "./pages/Announcement";
import PostAnnouncement from "./pages/PostAnnouncement";
import ManageAccounts from "./pages/ManageAccounts";
import EmployerSignup from "./components/EmployerSignup";
import EmployerSidebar from "./components/EmployerSidebar";
import EmployerDashboard from "./pages/EmployerDashboard";
import EmployerJobs from "./pages/EmployerJobs";
import EmployerPostJob from "./pages/EmployerPostJob";
import EmployerProfile from "./pages/EmployerProfile";
import ForgotPassword from "./components/ForgotPasswordAdmin";
function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();
  const [userType, setUserType] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const authenticateUser = () => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    const employerData = JSON.parse(localStorage.getItem("employer"));

    if (adminData) {
      setUserType("admin");
      setUserData(adminData);
    } else if (employerData) {
      setUserType("employer");
      setUserData(employerData);
    } else {
      setUserType(null);
      setUserData(null);
    }
  };

  useEffect(() => {
    authenticateUser();
    setLoading(false);
    window.addEventListener("storage", authenticateUser);
    return () => {
      window.removeEventListener("storage", authenticateUser);
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  const isLoginPage = location.pathname === "/";
  const isEmployerSignup = location.pathname === "/employer-signup";
  const isForgotPassword = location.pathname === "/employer/forgot-password";

  return (
    <div className="flex">
      {/* Show appropriate Sidebar based on user type */}
      {!isLoginPage && !isEmployerSignup && !isForgotPassword && (
        <>
          {userType === "admin" && <Sidebar />}
          {userType === "employer" && <EmployerSidebar />}
        </>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Login onLogin={authenticateUser} />} />
          <Route path="/employer-signup" element={<EmployerSignup />} />
          {/* <Route path="/employer/forgot-password" element={<ForgotPassword />} /> */}

          {/* Admin Routes - Protect Access */}
          {userType === "admin" ? (
            <>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/jobs" element={<MyJobs />} />
              <Route path="/admin/submit-job" element={<PostJob />} />
              <Route path="/admin/announcement" element={<Announcement />} />
              <Route path="/admin/post-announcement" element={<PostAnnouncement />} />
              <Route path="/admin/manage-account" element={<ManageAccounts />} />
            </>
          ) : (
            <Route path="/admin/*" element={<Navigate to="/" replace />} />
          )}

          {/* Employer Routes - Protect Access */}
          {userType === "employer" ? (
            <>
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
              <Route path="/employer/profile" element={<EmployerProfile employer={userData} />} />
              <Route path="/employer/jobs" element={<EmployerJobs />} />
              <Route path="/employer/post-job" element={<EmployerPostJob />} />
              <Route path="/employer/forgot-password" element={<ForgotPassword />} />
            </>
          ) : (
            <Route path="/employer/*" element={<Navigate to="/" replace />} />
          )}

          {/* Catch-All: Redirect Unauthorized Users */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;