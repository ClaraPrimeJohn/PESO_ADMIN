import React from 'react'
import PostJobForm from '../components/PostJobForm'

const PostJob = () => {
  return (
    <div className="h-screen flex flex-col bg-green-50 overflow-hidden corner-radius">
      <div className="flex-1 overflow-y-scroll ">
        <PostJobForm />
      </div>
    </div>
  )
}

export default PostJob