import React from 'react'
import PostAnnouncementForm from '../components/PostAnnouncementForm'

const PostAnnouncement = () => {
    return (
        <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
            <div className="flex-1 overflow-y-scroll ">
                <PostAnnouncementForm />
            </div>
        </div>
    )
}

export default PostAnnouncement