import React from 'react';
import { FaUserCircle, FaCheckCircle, FaPaperPlane, FaBriefcase } from 'react-icons/fa'; 

function DashboardCard({ number, label, icon, className }) {
  return (
    <div className={`bg-white p-4 m-1 sm:p-6 lg:p-8 rounded-3xl shadow-md flex items-center justify-between transition-transform transform hover:translate-y-[-5px] hover:shadow-lg cursor-pointer ${className}`}>
      <div className="flex flex-col items-start text-left">
        <div className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">{number}</div>
        <div className="text-xs sm:text-sm text-gray-500">{label}</div>
      </div>
      <div className="text-green-400 text-4xl sm:text-3xl ml-4">{icon}</div>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 mt-10 sm:mb-12 flex justify-start">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        <DashboardCard 
          number="07" 
          label="Posted Jobs" 
          icon={<FaUserCircle />} 
        />
        <DashboardCard 
          number="03" 
          label="Shortlisted" 
          icon={<FaCheckCircle />} 
        />
        <DashboardCard 
          number="1.7k" 
          label="Applications" 
          icon={<FaPaperPlane />} 
        />
        <DashboardCard 
          number="04" 
          label="Saved Candidates" 
          icon={<FaBriefcase />} 
        />
      </div>
    </div>
  );
}

export default Dashboard;
