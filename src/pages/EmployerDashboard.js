import React from 'react'
import DashboardCard from '../components/DashboardCard';
import JobDashboard from '../components/JobDashboard';

const EmployerDashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
      <div className="flex-1 overflow-y-scroll ">
          <DashboardCard />
          <JobDashboard />
      </div>
    </div>
  )
}

export default EmployerDashboard