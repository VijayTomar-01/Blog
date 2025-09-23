import React from 'react'
import { useAuthContext } from './useAuthContext'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const useLogin = () => {

  const {login, axios} = useAuthContext();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    setLoading(true);

    try {
      const response = await axios.post('/api/user/login', {email, password})
      if(response?.data && response?.data?.user && response?.data?.token){
        login(response?.data?.user, response?.data?.token)
        toast.success(`Welcome back ${response?.data?.user?.name}`)
        navigate('/')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed")
    }
  }

  return {loading, loginUser, navigate}
}

export default useLogin