import React, { useState } from 'react'
import useSignup from '../hooks/useSignup'
import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const {signup, loading} = useSignup();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const onSubmitHandler = (e) => {
    e.preventDefault();
    signup(name, email, password);
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gradient-to-br from-[#f0f4f8] to-[#d9e2ec]'>
      <div className='max-w-sm w-full max-md:m-6 shadow-xl shadow-primary/80 rounded-lg p-6 border-primary/35 bg-gradient-to-br from-white to-[#ffe6e6]'>
        <div className='flex flex-col items-center justify-center'>

          <div className='text-center'>
            <h1 className='text-2xl font-bold mb-4'>Signup</h1>
            <p className='text-lg mb-6'>Enter the <span className='text-primary border-b'>Credentials</span> and get the latest updates</p>
          </div>

          <form
          onSubmit={onSubmitHandler} 
          className='w-full sm:max-w-md text-gray-800'>

            <div className='flex flex-col'>
              <label className='font-medium'>Name</label>
              <input 
              className='border-b-2 border-gray-500 outline-none px-3 py-1'
              onChange={(e)=> setName(e.target.value)}
              value={name}
              type="text" 
              placeholder='Enter your name'
              />
            </div>

            <div
            className='flex flex-col mt-3'>
              <label className='font-medium'>Email</label>
              <input 
              className='border-b-2 border-gray-500 outline-none px-3 py-1'
              onChange={(e)=> setEmail(e.target.value)}
              value={email}
              type="text" // used text as type because the browser is not showing the validation toast (maybe in built browser validation)
              placeholder='Enter your Email'
              />
            </div>

            <div className='flex flex-col mt-3'>
              <label className='font-medium'>Password</label>
              <input 
              className='border-b-2 border-gray-500 outline-none px-3 py-1'
              onChange={(e)=> setPassword(e.target.value)}
              value={password}
              type="password" 
              placeholder='Enter your password'
              />
            </div>

            <button
            disabled={loading}
            className='w-full mt-5 bg-primary/80 py-2.5 px-3 cursor-pointer text-gray-300 rounded-full shadow-md shadow-primary/60 hover:bg-primary hover:scale-103' 
            type='submit'>
              {loading ? 'Signing up...' : 'Signup'}
            </button>
          </form>
          <div className='mt-4'>
            <p>Already have an account? <span className='text-primary/45 hover:text-primary/90 hover:border-b cursor-pointer' onClick={()=> navigate('/login')}>Login</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup