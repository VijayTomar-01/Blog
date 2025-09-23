import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBlogContext } from '../../hooks/useBlogContext'
import { assets, blogCategories } from '../../assets/assets'
import Quill from "quill";

const EditBlog = () => {

  const {id } = useParams()
  const {fetchSingleBlog, updateBlog, singleBlog, loading} = useBlogContext()
  const navigate = useNavigate()

  const editRef = useRef()
  const quillRef = useRef()

  const [image, setImage] = useState(null)
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [content, setContent] = useState("");

  // need to fetch the blog data in the form
  useEffect(()=>{
    if(id) fetchSingleBlog(id)
  }, [id])

  useEffect(() => {
    if(singleBlog){
      setTitle(singleBlog.title || "")
      setSubTitle(singleBlog.subTitle || "")
      setContent(singleBlog.content || "")
      setCategory(singleBlog.category || "Startup")

      if(quillRef.current){
        quillRef.current.root.innerHTML = singleBlog.content || ""
      }
    }
  }, [singleBlog])

  useEffect(()=>{
    if(!quillRef.current && editRef.current){
        quillRef.current = new Quill(editRef.current, { theme: "snow" });
        quillRef.current.on("text-change", () => {
          setContent(quillRef.current.root.innerHTML);
        });
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData;
    if(title !== singleBlog.title) formData.append("title", title)
    if(subTitle !== singleBlog.subTitle) formData.append("subTitle", subTitle)
    if(content !== singleBlog.content) formData.append("content", content)
    if(category !== singleBlog.category) formData.append("category", category)
    if(image) formData.append("image", image)

      const response = await updateBlog(id, formData)
      if(response.success) {
        navigate('/dashboard/manage-blog')
      }
  }

  return (
    <form
        onSubmit={handleSubmit} 
        className='flex flex-col w-full bg-blue-50/50 h-full overflow-scroll text-gray-600'>
          <div className='bg-white w-full max-w-3xl p-4 shadow rounded sm:p-12 md:p-8'>
            <p>Upload Thumbnail</p>
            <label htmlFor="image">
              <img
              className='mt-3 h-16 rounded cursor-pointer' 
              src={!image ? assets.upload_area || singleBlog?.image : URL.createObjectURL(image)} alt="" />
              <input
              onChange={(e) => setImage(e.target.files[0])} 
              type="file" id='image' hidden />
            </label>
    
            <p className='mt-3 font-light '>Blog Title</p>
            <input
            onChange={(e)=> setTitle(e.target.value)}
            value={title}
            className='w-full max-w-lg border border-gray-300 outline-none mt-2 p-2 rounded' 
            type="text" placeholder='Title' />
    
            <p className='mt-3 font-light '>Blog SubTitle</p>
            <input
            onChange={(e)=> setSubTitle(e.target.value)}
            value={subTitle}
            className='w-full max-w-lg border border-gray-300 outline-none mt-2 p-2 rounded' 
            type="text" placeholder='Subtitle' />
    
            <p className='mt-3 font-light'>Blog Content</p>
            <div className='max-w-lg h-84 pt-2 pb-16'>
              <div ref={editRef}></div>
            </div>
    
            <p className='mt-3 font-light'>Category</p>
            <select
            className='mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded'
            onChange={(e) => setCategory(e.target.value)} 
            value={category}
            name="category" id="category">
              <option value="">Select Catgory</option>
              {blogCategories.map((item, index) => (
                <option value={item} key={index}>{item}</option>
              ))}
            </select>
    
            <div>
              <button
              type='submit'
              disabled={loading} 
              className='mt-6 px-12 py-3 bg-primary/80 hover:bg-primary text-white rounded-lg'>
              {loading ? "Updating..." : "Update Blog"}
            </button>
            </div>
          </div>
        </form>
  )
}

export default EditBlog