import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-hot-toast";
import {
  CiViewList,
  CiSquarePlus,
  CiGrid41,
  CiLogout,
  CiUser,
} from "react-icons/ci";
import defaultProfile from '../assets/user.png';
import mainLogo from '../assets/mainLogo.png';

const EmployerSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');

  const loadEmployerData = () => {
    const employerInfo = JSON.parse(localStorage.getItem('employer') || '{}');
    setCompanyName(employerInfo.companyName || 'Company Name');
    setCompanyLogo(employerInfo.companyLogo || '');
  };

  useEffect(() => {
    loadEmployerData();

    // Listen for changes in localStorage (profile updates)
    const handleStorageChange = (event) => {
      if (event.key === 'employer') {
        loadEmployerData(); // Reload profile details dynamically
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isActive = (path) =>
    location.pathname === path ? 'bg-green-200' : 'hover:bg-green-100';

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('employer');

    setIsLogoutConfirmOpen(false);
    navigate('/');
    setTimeout(() => {
      toast.success('Logged out!', {
        duration: 2000,
      });
    }, 500);
  };

  const cancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-full bg-white p-6 flex flex-col overflow-hidden">
        {/* Logo Section */}
        <div className="flex items-center justify-center p-4">
          <img className="w-auto h-12" src={mainLogo} alt="logo" />
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={companyLogo || defaultProfile}
            alt="Company Logo"
            className="rounded-full h-16 w-16 object-cover border border-gray-300 shadow"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultProfile;
            }}
          />
          <span className="text-lg font-semibold mt-2">{companyName}</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 text-sm">
          <Link
            to="/employer/dashboard"
            className={`flex items-center p-2 text-gray-700 ${isActive(
              '/employer/dashboard'
            )} rounded-lg transition duration-300`}
          >
            <CiGrid41 className="mr-2 text-xl" />
            Dashboard
          </Link>
          <Link
            to="/employer/profile"
            className={`flex items-center p-2 text-gray-700 ${isActive(
              '/employer/profile'
            )} rounded-lg transition duration-300`}
          >
            <CiUser className="mr-2 text-xl" />
            Profile
          </Link>
          <Link
            to="/employer/jobs"
            className={`flex items-center p-2 text-gray-700 ${isActive(
              '/employer/jobs'
            )} rounded-lg transition duration-300`}
          >
            <CiViewList className="mr-2 text-xl" />
            My Jobs
          </Link>
          <Link
            to="/employer/post-job"
            className={`flex items-center p-2 text-gray-700 ${isActive(
              '/employer/post-job'
            )} rounded-lg transition duration-300`}
          >
            <CiSquarePlus className="mr-2 text-xl" />
            Post a Job
          </Link>
        </nav>

        {/* Log Out Link */}
        <div className="mt-auto p-2 text-sm">
          <button onClick={handleLogout} className={`flex items-center p-2 text-red-500 font-semibold ${isActive('/logout')} rounded-lg transition duration-300 w-full`}>
            <CiLogout className="mr-2 text-xl" />
            Log Out
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 sm:w-80 md:w-96 lg:w-1/5">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Are you sure you want to log out?
            </h3>
            <div className="flex justify-center space-x-4">
              <button className="bg-red-600 text-white px-2 py-2 rounded-md text-base w-full sm:w-auto" onClick={confirmLogout}>
                Yes, Log Out
              </button>
              <button className="bg-gray-300 text-black px-2 py-2 rounded-md text-base w-full sm:w-auto" onClick={cancelLogout}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerSidebar;
