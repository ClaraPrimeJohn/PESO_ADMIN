import React from 'react'
import EmployerPostJobForm from '../components/EmployerPostJobForm'

const EmployerPostJob = () => {
    return (
        <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
            <div className="flex-1 overflow-y-scroll ">
                <EmployerPostJobForm />
            </div>
        </div>
    )
}

export default EmployerPostJob