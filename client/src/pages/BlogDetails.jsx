import React, { useEffect } from 'react'
import { useBlogContext } from '../hooks/useBlogContext'
import Loader from '../components/Helper/Loader';
import Navbar from '../components/Home/Navbar';
import { useParams } from 'react-router-dom';
import Moment from 'moment'
import { useCommentContext } from '../hooks/useCommentContext';
import { useState } from 'react';
import Footer from '../components/Home/Footer';
import DOMPurify from 'dompurify'
import { useAuthContext } from '../hooks/useAuthContext';

const BlogDetails = () => {

  const {id} = useParams();
  const {singleBlog, loading: blogLoading, fetchSingleBlog} = useBlogContext();
  const {commentByBlog, fetchCommentsByBlog, loading: commentLoading, addComment} = useCommentContext()
  const [newComment, setNewComment] = useState("")
  const {user, token} = useAuthContext()
  


  useEffect(()=>{
  if(id && token){
    fetchSingleBlog(id);
    fetchCommentsByBlog(id);
  }
}, [id, token]);

  const blog = singleBlog;
  const comments = commentByBlog[id] || [];
  console.log("Comments", comments);


  const handleAddComment = async (e) => {
    e.preventDefault();
    if(!newComment.trim()) return
    await addComment(id, newComment) //the blogId
    setNewComment("")
  }

  const decodeAndSanitize = (html) => {
    if(!html) return ""
    const decoded = new DOMParser().parseFromString(html, "text/html").documentElement.textContent;
    return DOMPurify.sanitize(decoded);
  };
  
  return (
    <>
      {!user ? (
        <div>
          <Navbar/>
          <p className='text-center mt-15 text-2xl font-bold bg-gradient-to-l w-3xl mx-auto py-2 rounded-xl shadow-md shadow-primary from-teal-200 via-teal-300 to-teal-400'>Please Login to View the details of this blog 🔒</p>
        </div>
      ): blogLoading ? (
        <Loader/>
      ) : !singleBlog ? (
        <p>Details for this Blog is not available</p>
      ) : (
        <div className='relative'>
          <Navbar/>

          <div className='text-center mt-20 text-gray-600'>
            <p className='text-primary text-md font-semibold border-b w-sm mx-auto border-b-primary/10'>Published on {Moment(blog?.createdAt).format('MMMM Do YYYY')}</p>
            <h1 className='mt-4 text-2xl xl:text-5xl md:text-4xl sm:text-3xl text-gray-800 font-bold border-b w-sm mx-auto border-b-primary/10'>{blog?.title}</h1>
            <h3 className='mt-4 text-gray-500 max-w-lg mx-auto'>{blog?.subTitle}</h3>
            <img
            className='rounded-lg w-2xl sm:w-5xl md:w-4xl lg:w-3xl mx-auto mt-5 mb-8' 
            src={blog?.image} alt={blog?.title} />

            <div
              className='rich-text max-w-3xl mx-auto'
              dangerouslySetInnerHTML={{ __html: decodeAndSanitize(blog?.content) }}
            ></div>
            <span className='text-sm font-semibold block text-right mr-[15rem] mt-2 w-[12rem] mx-auto border-b text-primary bg-gradient-to-r from-blue-100 via-purple-300 to-red-400 py-1.5 px-2 rounded shadow-md shadow-primary/45'>By ~ {blog?.authorId?.name}</span>
          </div>

        {/* Comments section */}
        <div className='max-w-3xl mx-auto mt-16 flex flex-col justify-center items-center gap-8 px-3'>
          <h2>Comments ({comments?.length})</h2>

          {commentLoading ? (
            <Loader/>
          ) : comments?.length === 0 ? (
            <p className='text-red-500 bg-gradient-to-tr from-blue-200 to indigo-400 mt-2 mb-5 text-center border w-xs mx-auto py-2.5'>No Comments yet. Be the First</p>
          ) : (
            <div className='space-y-4'>
              {comments?.map((item) => (
                <div
                className='border px-2 py-2.5 rounded-lg w-lg mt-5 mb-3 shadow-md shadow-primary/80 bg-gradient-to-r from-orange-200 via-red-200 to-pink-200' 
                key={item._id}>
                  <p className='text-sm font-light px-3 text-gray-600'>{item?.content}</p>
                  <p className='text-right text-sm font-light text-gray-600'>~ {item?.authorId?.name || 'guest'}</p>
                  <p className='text-xs text-gray-600 font-light text-right'>{Moment(item?.createdAt).fromNow()}</p>
                </div>
              ))}
            </div>
          )}

          {/* comment form */}
          { user ? 
          (
            <div
          className='flex flex-col items-start ' >
            <p className='text-md text-gray-600 mb-3 font-semibold'>Add Comment</p>
            <form
            className='flex flex-col items-start gap-4 max-w-lg' 
            onSubmit={handleAddComment}>
              <textarea
              className='focus:ring focus:ring-primary/60 p-3 rounded-lg max-w-2xl w-lg mb-4 border border-gray-400'
              onChange={(e)=> setNewComment(e.target.value)}
              value={newComment}
              placeholder='Write your comment here'
              name="" id=""></textarea>
              <button
              className='border px-7 py-2.5 mb-4 mx-auto mt-6 bg-primary/50 text-gray-200 rounded-full hover:bg-gradient-to-r from-primary/20 to-primary transition-all duration-300 font-semibold hover:scale-103' 
              type='submit'>
              Submit
              </button>
            </form>
          </div> 
          ) : (
            <p className='text-center text-xl font-semibold text-red-500'>Please log in to post a comment.</p>
          )}
        </div>

        </div>
      )}
      <Footer/>
      
    </>
  )
}

export default BlogDetails