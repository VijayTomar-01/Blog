import Quill from 'quill'
import React, { useEffect, useRef, useState } from 'react'
import { useBlogContext } from '../../hooks/useBlogContext'
import { assets, blogCategories } from '../../assets/assets'
import toast from 'react-hot-toast'
const CreateBlog = () => {

  const {createBlog, loading} = useBlogContext()
  const editorRef = useRef()
  const quillRef = useRef()

  const [image, setImage] = useState(null)
  const [title, setTitle] = useState("")
  const [subTitle, setSubTitle] = useState("")
  const [category, setCategory] = useState('Statrup')
  const [content, setContent] = useState('')


  useEffect(()=>{
    if(!quillRef.current && editorRef.current){
      quillRef.current = new Quill(editorRef.current, {theme: 'snow'})
      quillRef.current.on('text-change', () => {
        setContent(quillRef.current.root.innerHTML) // get quill editor content
      })
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !title || !subTitle || !content || !category) {
      return toast.error("Please fill in all fields")
    }

    const formData = new FormData()
    formData.append("title", title)
    formData.append("subTitle", subTitle)
    formData.append("content", content)
    formData.append("category", category)
    formData.append("image", image)

    await createBlog(formData)

      setImage(null)
      setTitle("")
      setSubTitle("")
      setCategory("Startup")
      setContent("")
      if (quillRef.current) {
      quillRef.current.root.innerHTML = ""
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
          src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
          <input
          onChange={(e) => setImage(e.target.files[0])} 
          type="file" id='image' hidden />
        </label>

        <p className='mt-3 font-light '>Blog Title</p>
        <input
        onChange={(e)=> setTitle(e.target.value)}
        value={title}
        className='w-full max-w-lg border border-gray-300 outline-none mt-2 p-2 rounded' 
        type="text" placeholder='Title' required/>

        <p className='mt-3 font-light '>Blog SubTitle</p>
        <input
        onChange={(e)=> setSubTitle(e.target.value)}
        value={subTitle}
        className='w-full max-w-lg border border-gray-300 outline-none mt-2 p-2 rounded' 
        type="text" placeholder='Subtitle' required/>

        <p className='mt-3 font-light'>Blog Content</p>
        <div className='max-w-lg h-84 pt-2 pb-16'>
          <div ref={editorRef}></div>
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
          {loading ? "Adding..." : "Add Blog"}
        </button>
        </div>
      </div>
    </form>
  )
}

export default CreateBlog