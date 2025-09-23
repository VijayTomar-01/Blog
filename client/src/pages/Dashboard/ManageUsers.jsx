import React, { useEffect, useState } from 'react'
import { useUserContext } from '../../hooks/useUserContext'
import toast from 'react-hot-toast'
import Loader from '../../components/Helper/Loader'

const ManageUsers = () => {

  const {users, loading, fetchAllUsers, updateUser, deleteUser, profile, fetchProfile} = useUserContext()
  const [userEditId, setUserEditId] = useState(null)
  const [editData, setEditData] = useState({name: '', email: '', password: ''})

  useEffect(()=> {
    fetchAllUsers();
    fetchProfile()
  }, [])

  const handleEditClick = (user) => {
    setUserEditId(user._id)
    setEditData({name: user.name, email: user.email, password: ''})
  }

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (userId, editData) => {
    try {
      const payload = {...editData} // edit data contain name, email and password so to not save empty password
        if(!payload.password){
          delete payload.password
        }
      await updateUser(userId, payload)
      toast.success('User updated successfully')
      setUserEditId(null)
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const handleDelete = async (userId) => {
    try {
      if(window.confirm("Do you want to delete this user?")){
      await deleteUser(userId)
      toast.success('User Deleted Successfully')
      }
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }
  // if (loading || !profile) return <Loader />;
 
  return (
    <>
      {loading ? <Loader/>
      : (
        <div className='space-y-6'>
          <h2 className='text-center font-semibold text-2xl w-xs mx-auto border-b-gray-300 border-b py-1. 5'>Manage Users</h2>

          {users.length === 0 ? (
            <p className='text-2xl text-center m-4 text-red-500'>No users found</p>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 '>
              {users.map((user)=> (
                <div key={user._id} className=' bg-white gap-6 rounded-xl shadow-md shadow-primary p-5'>
                  {userEditId === user._id ? (
                    <div>
                      <input
                      className='border px-2.5 py-1 rounded-lg border-gray-400 outline-none overflow-hidden mb-2'
                      onChange={handleEditChange}
                      placeholder='Name'
                      name='name'
                      value={editData.name} 
                      type="text" />
                      <input
                      className='border px-2.5 py-1 rounded-lg border-gray-400 outline-none overflow-hidden mb-2'
                      onChange={handleEditChange}
                      name='email'
                      placeholder='Email'
                      value={editData.email} 
                      type="email" />
                      <input
                      className='border px-2.5 py-1 rounded-lg border-gray-400 outline-none overflow-hidden mb-2'
                      onChange={handleEditChange}
                      name='password'
                      placeholder='Password'
                      value={editData.password} 
                      type="password" />

                      <div className='flex items-center justify-between mx-auto'>
                        <button
                        onClick={()=> handleUpdate(user._id, editData)}
                        className='bg-green-300/80 px-4 py-1.5 rounded-lg font-semibold hover:scale-102 hover:bg-green-500 hover:text-gray-200'>
                          Save
                        </button>
                        <button
                        onClick={()=> setUserEditId(null)}
                        className='bg-yellow-300/80 px-4 py-1.5 rounded-lg font-semibold hover:scale-102 hover:bg-yellow-500 hover:text-gray-100'>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className=''>
                      <p className='text-lg font-semibold text-center'>{user.name}</p>
                      <p className='text-lg font-semibold text-center'>{user.email}</p>
                      <p className='text-lg font-semibold text-center'>Role: {" "}
                        <span className='text-primary border-b border-gray-300'>{user.role}</span>
                      </p>
                      <div className='flex items-center justify-between w-[12rem] mx-auto mt-4'>
                        <button 
                        onClick={()=> handleEditClick(user)}
                        className='bg-yellow-600/30 px-4 py-1.5 rounded-lg font-semibold hover:bg-yellow-300 hover:scale-102'>
                          Edit
                        </button>
                        <button 
                        onClick={()=> handleDelete(user._id)}
                        className='bg-red-600/30 px-4 py-1.5 rounded-lg font-semibold text-gray-100 hover:bg-red-500/90 hover:scale-102'>
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default ManageUsers