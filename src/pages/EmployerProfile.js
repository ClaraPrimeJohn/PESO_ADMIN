import React from 'react'
import EmployerProfileCard from '../components/EmployerProfileCard'

const EmployerProfile = () => {
    return (
        <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
            <div className="flex-1 overflow-y-scroll ">
                <EmployerProfileCard/>
            </div>
        </div>
    )
}

export default EmployerProfile