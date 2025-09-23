import React, { useEffect } from 'react'
import { useBlogContext } from '../../hooks/useBlogContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import Loader from '../../components/Helper/Loader'
import Moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useDashboardContext } from '../../hooks/useDashboardContext'

const ManageBlog = () => {

  const {dashboard, fetchDashboard, loading} = useDashboardContext()
  const {user} = useAuthContext()
  const navigate = useNavigate()

  const handleDelete = async (id) => {
    if(window.confirm("Do you want to delete this blog")){
      await deleteBlog(id)
      fetchDashboard()
    }
  }

  useEffect(()=> {
    fetchDashboard()
  }, [])


  const allBlogs = dashboard?.recentBlogs ? [...dashboard.recentBlogs] : []


  return (
    <>
      {loading || !dashboard ? <Loader/>
      : (
        <div className='bg-gray-100 min-h-screen p-6'>
          <h1 className='text-center font-semibold text-2xl w-xs mx-auto border-b-gray-300 border-b py-1.5'>Manage Blogs</h1>

          {allBlogs.length === 0 ?
          (<p className='mt-6 text-center text-2xl font-bold text-red-400'>You Don't have any Blogs. {" "}
            <span
            onClick={()=> navigate('/dashboard/create-blog')} 
            className='text-primary/60 cursor-pointer border-b hover:text-primary'>Create and share your own blog?</span>
          </p>) 
          : (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 '>
              {allBlogs.map((blog) => {
               const canManage = user?.role === "admin" || user?._id === blog?.authorId?._id 
               return (
                <div key={blog?._id}
                // onClick={()=> navigate(`/blog/${blog._id}`)}
                className='bg-white flex flex-col shadow-lg rounded-xl cursor-pointer hover:scale-103 shadow-primary/45'>
                  <div className=''>
                    <h2 className='px-2.5 py-2 text-center text-lg font-semibold'>{blog?.title}</h2>
                    <p className='text-center pb-2 font-medium text-sm'>Category: {" "}
                      <span className='text-primary'>{blog?.category}</span>
                    </p>
                    <p className='text-sm text-center text-gray-600 pb-2'>
                      Status: {" "}
                      {blog.isPublished ? (
                        <span className='font-semibold text-green-500'>Published</span>
                      ) : (
                        <span className='font-semibold text-red-500'>Draft</span>
                      )}
                    </p>
                    <p className='text-xs text-right px-2 pb-2 '>
                      Created: {" "}
                      <span className='text-primary/80 border-b border-b-gray-400'>{Moment(blog.createdAt).format("Do, MMMM, YYYY")}</span> 
                    </p>

                    {canManage && (
                      <div className='flex item-center justify-between gap-3 p-2'>
                      <button
                      onClick={()=> handleDelete(blog._id)}
                      className='border px-3.5 py-1 text-sm font-semibold rounded-lg bg-red-500 text-gray-100 hover:bg-red-700'>
                        Delete
                      </button>
                      <button
                      onClick={() => navigate(`/dashboard/edit-blog/${blog._id}`)}
                      className='border px-3.5 py-1 text-sm font-semibold rounded-lg bg-green-400 text-white hover:bg-green-600'>
                        Edit
                      </button>
                      </div>
                    )}
                  </div>
                </div>
               ) 
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ManageBlog