import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';
import { assets } from '../../assets/assets';

const Navbar = () => {

  const navigate = useNavigate();
  const {user, logout} = useAuthContext();

  const handleClick = () => {
    if(!user){
      navigate('/login')
    } else {
      navigate('/dashboard')
    }
  }

  // const handleLogout = () => {
  //   logout()
  //   navigate('/')
  // }

  return (
    <div className='flex items-center justify-between mt-4 sm:mt-16 md:mt-8 '>
      <img 
      onClick={()=> navigate('/')}
      className='w-28 border rounded-full cursor-pointer border-primary/80 shadow-md shadow-primary/35 hover:scale-103 ml-8'
      src={assets.logo} alt="logo" />

      <button
      onClick={handleClick} 
      className='border-none cursor-pointer flex gap-3 py-2.5 px-5 font-medium rounded-full  bg-primary/70 text-gray-200 shadow-md shadow-primary/60 hover:scale-103 hover:bg-primary mr-8 mb-8'>
        {user ? (user.role === "admin" ? "Admin Dashboard" : "Dashboard") : "Login"}
        <img 
        className='w-4'
        src={assets.arrow} alt="arrow" />
      </button>

      {/* {user && (
          <button
            onClick={handleLogout}
            className='border-none py-2.5 px-5 font-medium rounded-full bg-red-500 text-white shadow-md shadow-red-400 hover:scale-103 hover:bg-red-600'>
            Logout
          </button>
        )} */}
    </div>
  )
}

export default Navbar