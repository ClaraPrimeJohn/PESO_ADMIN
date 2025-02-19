import React from 'react'
import TableAnnouncements from '../components/TableAnnouncement'

const Announcement = () => {
    return (
        <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
            <div className="flex-1 overflow-y-scroll ">
                <TableAnnouncements />
            </div>
        </div>
    )
}

export default Announcement