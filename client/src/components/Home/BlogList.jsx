import React from 'react'
import { useBlogContext } from '../../hooks/useBlogContext'
import BlogTile from './BlogTile'
import Loader from '../Helper/Loader'

const BlogList = ({filteredBlogs, loading}) => {

  const blogsToDisplay = filteredBlogs?.length > 0 ? filteredBlogs : [];


  return (
    <>
      {loading ? (
        <Loader/>
      ) : blogsToDisplay.length === 0 ? (
        <p>No Blogs Found</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mr-12 gap-8'>
          {blogsToDisplay.map((blog)=>(
            <BlogTile key={blog._id} blog={blog}/>
          ))}
        </div>
      )}
    </>
  )
}

export default BlogList