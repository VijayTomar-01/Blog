import React, { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';

const useSignup = () => {

  const {axios} = useAuthContext();
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const signup = async (name, email, password) => {
    setLoading(true);

    try {
      const response = await axios.post('/api/user/signup', {name, email, password})
      if(response?.data){
        toast.success(response?.data?.message || "Signup successful");
        navigate('/login');
      }
      console.log(response.data);
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup Failed!")
    } finally {
      setLoading(false);
    }
  }
  return {signup, loading}
}

export default useSignup