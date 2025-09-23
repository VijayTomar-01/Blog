import React, { useEffect } from 'react'
import { useCommentContext } from '../../hooks/useCommentContext'
import { useAuthContext } from '../../hooks/useAuthContext'
import Loader from '../../components/Helper/Loader'

const ManageComments = () => {

  const {userComments, approveComment, loading, fetchUserComments, deleteComment} = useCommentContext()
  const {user} = useAuthContext()

  useEffect(()=>{
    fetchUserComments() //it already handles admin and user roles in backend
  }, [])

  const canApprove = (comment) => user.role === "admin" && !comment.isApproved;

  const canDelete = (comment) => user.role === "admin" || comment.authorId?._id === user._id;

  const handleApprove = async (comment) => {
    await approveComment(comment._id, comment.blogId?._id);
    await fetchUserComments();
  };

  const handleDelete = async (comment) => {
    await deleteComment(comment._id, comment.blogId?._id);
    await fetchUserComments();
  };

  return (
    <>
      {!user ? (
        <Loader/>
      ) : (
        <div className='p-6'>
          <h2 className='text-center font-semibold text-2xl w-xs mx-auto border-b-gray-300 border-b py-1. 5'>Manage Comments</h2>
          {loading && <Loader/>}
          {!loading && userComments.length === 0 && <p>No Comments yet</p>}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-8'>
            {userComments.map((comment)=>(
                <div key={comment._id}
                className='bg-white p-4 rounded-xl shadow-md shadow-primary flex flex-col gap-2'>
                  <p className='text-md font-medium text-center '>Blog: {" "}
                    <span className='text-primary'>{comment.blogId?.title}</span>
                  </p>
                  <p className='text-md font-medium text-center'>Author: {" "}
                    <span className='text-primary'>{comment.authorId?.name}</span>
                  </p>
                  <p className='text-md font-medium text-center'>Content: {" "}
                    <span className='font-light'>{comment.content}</span>
                  </p>
                  <p className='text-md font-medium text-center'>Status: {" "}
                    {comment.isApproved ? (
                      <span className='text-green-500'>Approved</span>
                    ): (
                      <span className='text-red-400'>Pending</span>
                    )}
                  </p>
                  <div className='flex justify-between w-xs mx-auto'>
                    {canApprove(comment) && (
                        <button 
                        onClick={()=>handleApprove(comment)}
                        className='bg-green-600/30 font-semibold px-4 py-1.5 rounded-lg shadow-md shadow-primary hover:bg-green-600/80'>
                        Approve
                        </button>
                    )}
                    {canDelete(comment) && (
                      <button
                      className='bg-red-600/30 font-semibold px-4 py-1.5 rounded-lg shadow-md shadow-primary hover:bg-red-500/90 text-gray-100'
                      onClick={()=> handleDelete(comment)}>
                        Delete
                      </button>
                    )}
                  </div>
                </div>  
              ))
            }))
          </div>
        </div>
      )}
    </>
  )
}

export default ManageComments