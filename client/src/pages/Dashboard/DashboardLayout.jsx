import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import Sidebar from '../../components/Dashboard/Sidebar'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {

  const {user} = useAuthContext()

  return (
    <div className='flex min-h-screen bg-gray-200'>
      <Sidebar role={user?.role}/>
      <main className='flex-1 p-6'>
        <Outlet/>
      </main>
    </div>
  )
}

export default DashboardLayout