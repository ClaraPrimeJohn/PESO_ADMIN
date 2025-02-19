
import React from 'react'
import Jobs from "../components/TableJobs"

const MyJobs = () => {
    return (
        <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
            <div className="flex-1 overflow-y-scroll ">
                <Jobs />
            </div>
        </div>
    )
}

export default MyJobs