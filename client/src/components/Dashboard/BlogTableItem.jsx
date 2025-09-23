import React, { useEffect, useState } from 'react'
import { useBlogContext } from '../../hooks/useBlogContext'
import { useDashboardContext } from '../../hooks/useDashboardContext'
import moment from 'moment'
import { useAuthContext } from '../../hooks/useAuthContext'

const BlogTableItem = ({blog, index}) => {

  const {togglePublish} = useBlogContext()
  const {fetchDashboard} = useDashboardContext()
  const {user} = useAuthContext()


  const handleToggle = async () => {
    await togglePublish(blog._id)
    await fetchDashboard()
  }

  return (
    <tr className='border-b border-b-gray-300 last:border-0'>
      <td className='px-2.5 py-3 text-left font-light'>{index}</td>
      <td className='px-2.5 py-3 text-left font-light'>{blog?.title}</td>
      <td className='px-2.5 py-3 text-left font-light'>{moment(blog?.createdAt).format("Do MMMM YYYY")}</td>
      <td className='px-2.5 py-3 text-left font-light'>
        <span className={`px-3 py-1 rounded-full font-light ${blog?.isPublished
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
        }`}>
          {blog?.isPublished ? "Published" : "Unpublished"}
        </span>
      </td>
      {user?.role === "admin" && (
        <td className='px-2.5 py-3 text-left font-light'>
          <button
          onClick={handleToggle} 
          className={`px-3 py-1 border rounded-full text-white ${blog?.isPublished
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-green-500 hover:bg-green-600'
          }`}>
            {blog?.isPublished ? "Unpublish" : "Publish"}
          </button>
        </td>
      )}
    </tr>
  )
}

export default BlogTableItem