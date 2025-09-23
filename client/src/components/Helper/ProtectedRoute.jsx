import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import Loader from './Loader';
import { Navigate, Outlet } from 'react-router-dom';

// Only autorized user with the correct role can access the protected routes
const ProtectedRoute = ({role}) => {

  const {user, loading} = useAuthContext();

  if(loading) return <Loader/>
  if(!user) return <Navigate to='/login' replace/>

  // if user and try to access the admin page will navigate to dashboard and replace will now allow to go back
  if(role && user.role !== role){
    return <Navigate to='/dashboard' replace/>
  }

  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default ProtectedRoute