import React from 'react'
import EmployerDashboardCard from '../components/EmployerDashboardCard';
import JobDashboard from '../components/JobDashboard';

const EmployerDashboard = () => {
  return (
    <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
      <div className="flex-1 overflow-y-scroll ">
          <EmployerDashboardCard />
          <JobDashboard />
      </div>
    </div>
  )
}

export default EmployerDashboard