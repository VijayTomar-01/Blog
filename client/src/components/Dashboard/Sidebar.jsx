import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {

  const {user, logout} = useAuthContext()
  const location = useLocation()
  const navigate = useNavigate()

  const linkClasses = (path) => {
    return `px-3 py-2 mx-4 rounded block ${location.pathname === path
      ? "bg-blue-600 text-white"
      : "hover:bg-gray-100"
    }`
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className='w-64 flex flex-col shadow-md bg-white'>
      <img
      className='w-28 border rounded-full ml-12 mt-8 shadow-md shadow-primary hover:scale-102'
      onClick={()=> navigate('/')} 
      src={assets.logo} alt="" />

      <nav className='flex flex-col gap-3 mt-6'>
        <Link to='/dashboard' className={linkClasses('/dashboard')}>
          Dashboard
        </Link>

        <Link to='/dashboard/create-blog' className={linkClasses('/dashboard/create-blog')}>
          Create Blog
        </Link>

        <Link to='/dashboard/manage-blog' className={linkClasses('/dashboard/manage-blog')}>
          Manage Blogs
        </Link>

        {user?.role === "admin" && (
          <Link to='/dashboard/manage-users' className={linkClasses('/dashboard/manage-users')}>
            Manage Users
          </Link>
        )}

        <Link to='/dashboard/manage-comments' className={linkClasses('/dashboard/manage-comments')}>
          {user?.role === "admin" ? "Manage Comments" : "My Comments"}
        </Link>

        <Link to='/dashboard/profile' className={linkClasses('/dashboard/profile')}>
          Profile
        </Link>

        <button
        onClick={handleLogout} 
        className='border-none w-35 rounded-full ml-12 bg-red-300 text-gray-700 py-1.5 hover:bg-red-600 hover:text-gray-100 hover:scale-106'>
          Logout
        </button>
      </nav>
    </aside>
  )
}

export default Sidebar