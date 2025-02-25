import React from 'react'
import JobApplicants from '../components/JobApplicants'

const Announcement = () => {
    return (
        <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
            <div className="flex-1 overflow-y-scroll ">
                <JobApplicants/>
            </div>
        </div>
    )
}

export default Announcement