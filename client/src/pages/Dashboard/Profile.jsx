import React, { useEffect, useState } from 'react'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useUserContext } from '../../hooks/useUserContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Loader from '../../components/Helper/Loader'

const Profile = () => {

  const {user, logout} = useAuthContext()
  const {updateUser, deleteUser, profile, fetchProfile, loading} = useUserContext()
  const [formData, setFormData] = useState({name: "", email: "", password: ""})
  const navigate = useNavigate()

  useEffect(()=>{
    fetchProfile();
  }, [])

  useEffect(()=> {
    if(profile){
      setFormData({
        name: profile.name,
        email: profile.email,
        password: ""
      })
    }
  }, [profile])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if(!profile) return

    const data = {}
    if (formData?.name?.trim()) data.name = formData.name;
    if (formData?.email?.trim()) data.email = formData.email;
    if (formData?.password?.trim()) data.password = formData.password;

    await updateUser(profile._id, data)
    toast.success("Profile updated successfully");
    setFormData({ ...formData, password: "" }); 
  } 

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return
    await deleteUser(profile._id)
    toast.success("Account Deleted Successfully")
    logout()
    navigate("/");
  }

  if(!profile) return <Loader/>

  return (
    <div className='mx-auto max-w-4xl sm:w-xl lg:w-2xl bg-white rounded p-6'>
      <h2 className='text-2xl font-semibold text-center'>Hi, {" "}
        <span className=''>{user.name}</span>
      </h2>

    <form onSubmit={handleUpdate} className='space-y-4'>
      <div className='mb-4 mt-3 flex flex-col'>
        <label className=''>Name</label>
        <input
        value={formData.name}
        onChange={handleChange}
        name='name'
        className='border w-sm rounded outline-none px-2 py-1.5 mt-2 ' 
        type="text"  />
      </div>
      <div className='mb-4 mt-3 flex flex-col'>
        <label className=''>Email</label>
        <input
        value={formData.email}
        onChange={handleChange}
        name='email'
        className='border w-sm rounded outline-none px-2 py-1.5 mt-2 ' 
        type="text"/>
      </div>
      <div className='mb-4 mt-3 flex flex-col'>
        <label className=''>Password</label>
        <input
        value={formData.password}
        onChange={handleChange}
        name='password'
        className='border w-sm rounded outline-none px-2 py-1.5 mt-2 ' 
        type="password"/>
      </div>
      <div className='flex justify-between w-xs items-center'>
        <button
        type='submit'
        className='px-3 py-1.5 rounded-lg bg-yellow-200 text-gray-600 font-bold border-none shadow-md shadow-primary/45 hover:scale-102 hover:bg-yellow-500'>
          {loading ? "Updating..." : "Update Profile"}
        </button>
        {user.role !== "admin" && (
          <button
          className='px-3 py-1.5 rounded-lg bg-red-200 text-gray-50 font-bold border-none shadow-md shadow-primary/45 hover:scale-102 hover:bg-red-500'
          onClick={handleDelete}
          disabled={loading}>
            {loading ? "Deleting..." : "Delete Profile"}
          </button>
        )}
      </div>
    </form>
    </div>
  )
}

export default Profile