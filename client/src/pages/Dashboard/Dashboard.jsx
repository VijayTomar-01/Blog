import React, { useEffect } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useDashboardContext } from '../../hooks/useDashboardContext'
import Loader from '../../components/Helper/Loader'
import { assets } from '../../assets/assets'
import BlogTableItem from '../../components/Dashboard/BlogTableItem'

const Dashboard = () => {

  const {user, loading} = useAuthContext()
  const {dashboard, fetchDashboard} = useDashboardContext();

useEffect(()=>{
  fetchDashboard();
}, [])
 
  return (
    <div className='min-h-screen'>
      <h1 className='text-2xl border-b w-sm mx-auto text-center border-gray-400 font-semibold'>Welcome, {user?.role === "admin" ? `Admin (${user?.name})` : user?.name} 👋</h1>

      {loading ?
      (
        <Loader/>
      ) : (
        <>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 rounded-lg gap-8'>
          <div className='flex items-center gap-4 bg-white rounded-lg p-5 shadow shadow-primary/80'>
            <img src={assets.dashboard_icon_1} alt="" />
            <div>
              <p className='text-lg text-center font-semibold'>{dashboard?.stats?.totalBlogs ?? 0}</p>
              <p className='text-center'>{user?.role === "admin" ? "Total Blogs" : "My Blogs"}</p>
            </div>
          </div>

          <div className='flex items-center gap-4 bg-white rounded-lg p-5 shadow shadow-primary/80'>
            <img src={assets.dashboard_icon_2} alt="" />
            <div>
              <p className='text-lg text-center font-semibold'>{dashboard?.stats?.totalComments ?? 0}</p>
              <p className='text-center'>{user?.role === "admin" ? "Total Comments" : "My Comments"}</p>
            </div>
          </div>

          <div className='flex items-center gap-4 bg-white rounded-lg p-5 shadow shadow-primary/80'>
            <img src={assets.dashboard_icon_3} alt="" />
            <div>
              <p className='text-lg text-center font-semibold'>{dashboard?.stats?.totalDrafts ?? 0}</p>
              <p className='text-center'>{user?.role === "admin" ? "Total Drafts" : "My Drafts"}</p>
            </div>
          </div>
        </div>

        <div className='mt-12 '>
          <h2 className='text-2xl text-center mx-auto w-xs border-b border-b-gray-300'>Recent Blogs</h2>
          <div className='relative max-w-4xl overflow-hidden rounded-lg mt-6'>
            <table className='text-sm text-gray-600 w-full bg-white'>
              <thead>
                <tr >
                  <th className='px-2.5 py-3 text-left'>#</th>
                  <th className='px-2.5 py-3 text-left'>Title</th>
                  <th className='px-2.5 py-3 text-left'>Date</th>
                  <th className='px-2.5 py-3 text-left'>Status</th>
                  {user.role === "admin" && (
                    <th className='px-2.5 py-3 text-left'>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {dashboard?.recentBlogs?.map((blog, i) => (
                  <BlogTableItem 
                  key={blog._id}
                  index={i+1}
                  blog={blog}/>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>        
      )}
    </div>
  )
}

export default Dashboard