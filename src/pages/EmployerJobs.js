import React from 'react'
import EmployerTableJobs from '../components/EmployerTableJobs'


const EmployerJobs = () => {
    return (
        <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
            <div className="flex-1 overflow-y-scroll ">
                <EmployerTableJobs/>
            </div>
        </div>
    )
}

export default EmployerJobs