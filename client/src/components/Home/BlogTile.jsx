import React from 'react'
import {useNavigate} from 'react-router-dom'


const BlogTile = ({blog}) => {

  const navigate = useNavigate();

  const truncateHTML = (html, wordLimit) => {
  // First decode escaped HTML (e.g., &lt;p&gt; -> <p>)
  const decoded = new DOMParser().parseFromString(html, "text/html").documentElement.textContent;

  // Then parse decoded string to remove real tags
  const doc = new DOMParser().parseFromString(decoded, "text/html");
  const text = doc.body.textContent || "";

  // Apply word limit
  const words = text.split(/\s+/);
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
};


  return (
    <div
    onClick={() => navigate(`/blog/${blog._id}`)} 
    className='w-full rounded-xl mt-12 mb-6 sm:mb-12 ml-6 overflow-hidden cursor-pointer gap-12 shadow hover:scale-102 hover:shadow-primary/50'>

      <img 
      src={blog.image} alt={blog.title} />
      <span className='mt-4 ml-5 mb-2 inline-block bg-primary/20 py-1.5 px-3 text-primary font-light rounded-full '>
        {blog.category}
      </span>

      <div className='p-6'>
        <h1 className='text-lg font-semibold text-ellipsis whitespace-nowrap overflow-hidden text-gray-900 border-b border-primary/10'>
          {blog.title}
        </h1>
        <h3 className='font-medium text-gray-500 text-sm mt-2 border-b border-b-primary/10 p-1.5 text-ellipsis overflow-hidden whitespace-nowrap'>
          {blog.subTitle}
        </h3>
        <p className='font-light text-sm text-gray-700 px-1.5 py-3 border-b border-primary/10'>
          {truncateHTML(blog.content, 50)}
        </p>
        <p className='text-sm font-light text-ellipsis overflow-hidden whitespace-nowrap pt-2 px-1.5 text-right '>
          {blog.authorId ? blog.authorId.name : "Anonymous Author"}
        </p>
      </div>


    </div>
  )
}

export default BlogTile