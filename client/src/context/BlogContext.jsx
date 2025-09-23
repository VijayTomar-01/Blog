import { useEffect, useReducer } from "react"
import { createContext } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import toast from 'react-hot-toast'


const initialState = {
  blogs: [],
  singleBlog: null,
  loading: false,
  error: "",
  searchResult: [],
}

export const blogReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {...state, loading: true, error: ""}
    case "SET_ERROR":
      return {...state, loading: false, error: action.payload}
    case "SET_BLOGS":
      return {...state, blogs: action.payload, loading: false, error: ""}
    case "SET_SINGLE_BLOG":
      return {...state, singleBlog: action.payload, loading: false, error: ""}
    case "CLEAR_SINGLE_BLOG":
      return {...state, singleBlog: null}
    case "SET_SEARCH_RESULT":
      return {...state, searchResult: action.payload, loading: false, error: ""}
  
    default:
      return state
  }
}

export const BlogContext = createContext()

const BlogProvider = ({children}) => {

  const [state, dispatch] = useReducer(blogReducer, initialState);
  const {axios, token} = useAuthContext();

  const handleError = (error, fallback = "Something went wrong") => {
  const message = error.response?.data?.message || error.message || fallback;
  toast.error(message);
  return message;
}

  const fetchAllBlogs = async () => {
    dispatch({type: "SET_LOADING"})
    try {
      const response = await axios.get('/api/blog')
      dispatch({type: "SET_BLOGS", payload: response.data.blogs || []})
    } catch (error) {
      const msg = handleError(error || "Error fetching blogs")
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const fetchSingleBlog = async (id) => {
    dispatch({type: "SET_LOADING"})
    try {
      const response = await axios.get(`/api/blog/${id}`)
      dispatch({type: "SET_SINGLE_BLOG", payload: response.data.blog || []})
    } catch (error) {
      const msg = handleError(error || "Error fetching blog")
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const createBlog = async (formData) => {
    dispatch({type: "SET_LOADING"})
    try {
      const response = await axios.post('/api/blog/create', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        },
        
      })
      toast.success("Blog Created Successfully");
      await fetchAllBlogs();
      return response.data;
    } catch (error) {
      const msg = handleError(error || "Error creating Blog")
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const updateBlog = async (id, formData) => {
    dispatch({type: "SET_LOADING"})
    try {
      const response = await axios.patch(`/api/blog/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      })
      toast.success("Blog updated successfully")
      await fetchAllBlogs()
      return response.data
    } catch (error) {
      const msg = handleError(error || "Error updating Blog")
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const deleteBlog = async (id) => {
    dispatch({type: "SET_LOADING"})
    try {
      const response = await axios.delete(`/api/blog/delete/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
      })
      toast.success("Blog Deleted Successfully")
      await fetchAllBlogs();
      return response?.data
    } catch (error) {
      const msg = handleError(error || "Error deleting the blog")
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const togglePublish = async (id) => {
    dispatch({type: "SET_LOADING"})
    try {
      const response = await axios.patch(`/api/blog/${id}/toggle-publish`, {}, {
        headers: {Authorization: `Bearer ${token}`}
      });
      toast.success("Blog publish status updated");
      await fetchAllBlogs();
      return response.data
    } catch (error) {
      const msg = handleError(error || "Error toggling publish status")
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  // Created if needed for dashboard but skipped and went with the local state only in home page
  
  // const searchResult = (query) => {
  //   if(!query.trim()){
  //     dispatch({type: "SET_SEARCH_RESULT", payload: []})
  //     return;
  //   }

  //   const filteredBlogs = state.blogs.filter((blog)=> 
  //     blog.title?.toLowerCase().includes(query.toLowerCase()) ||
  //     blog.subTitle?.toLowerCase().includes(query.toLowerCase()) ||
  //     blog.category?.toLowerCase().includes(query.toLowerCase())
  //   )
  //   dispatch({type: "SET_SEARCH_RESULT", payload: filteredBlogs})
  // }

  // const clearSearch = () => {
  //   dispatch({type: "SET_SEARCH_RESULT", payload: []})
  // }

  

  useEffect(()=>{
    fetchAllBlogs();
  }, [])

  const value = ({
    ...state,
    fetchAllBlogs,
    fetchSingleBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    togglePublish,
    // clearSearch,
    // searchResult
  })
  // console.log(value);
  

  return(
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  )
}

export default BlogProvider