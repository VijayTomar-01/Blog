import { createContext, useReducer } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import { useEffect } from "react"
import toast from "react-hot-toast"


const intitalState = {
  commentByBlog: {},
  userComments: [],
  loading: false,
  error: "",
}

export const commentReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {...state, loading: true, error: ""}
    case "SET_ERROR":
      return {...state, loading: false, error: action.payload}
    case "SET_BLOG_COMMENTS":
      return {...state, commentByBlog: {...state.commentByBlog, [action.blogId]: action.payload}, loading: false, error: ""}
    case "SET_USER_COMMENTS":
      return {...state, userComments: action.payload, loading: false, error: ""}
    default:
      return state;
  }
}

export const CommentsContext = createContext();

const CommentsProvider = ({children}) => {

  const [state, dispatch] = useReducer(commentReducer, intitalState);
  const {axios, token} = useAuthContext();
  const getAuthHeaders = () =>  token ? {Authorization: `Bearer ${token}`} : {};

  const handleError = (error, fallback = "Something went wrong") => {
    const message = error.response?.data?.message || error.message || fallback
    toast.error(message)
    return message
  }

  const fetchCommentsByBlog = async (blogId) => {
    dispatch({type: "SET_LOADING"});
    try {
      const response = await axios.get(`/api/comment/${blogId}`, {
        headers: getAuthHeaders()
      });
      console.log("Auth headers:", getAuthHeaders());
      dispatch({type: "SET_BLOG_COMMENTS", payload: response?.data?.comments, blogId: blogId.toString()  })
      console.log("Server response comments:", response?.data?.comments);
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const fetchUserComments = async () => {
    dispatch({type: "SET_LOADING"});
    try {
      const response = await axios.get(`/api/comment`, {
        headers: getAuthHeaders()
      })
      dispatch({type: "SET_USER_COMMENTS", payload: response.data.comments})
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const addComment = async (blogId, content) => {
    dispatch({type: "SET_LOADING"});
    try {
      const response = await axios.post('/api/comment/add-comment', {blogId, content}, {
        headers: getAuthHeaders()
      })
      toast.success(response.data.message || "Comment added successfully")
      await fetchCommentsByBlog(blogId)
      return response?.data?.comment
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const updateComment = async (content, commentId, blogId) => {
    dispatch({type: "SET_LOADING"});
    try {
      const response = await axios.put(`/api/comment/${commentId}`, {content}, {
        headers: getAuthHeaders()
      });
      toast.success(response.data.message || "Comment updated successfully")
      await fetchCommentsByBlog(blogId)
      return response?.data?.comment
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const deleteComment = async (commentId, blogId) => {
    dispatch({type: "SET_LOADING"});
    try {
      const response = await axios.delete(`/api/comment/${commentId}`, {
        headers: getAuthHeaders()
      })
      toast.success(response.data.message || "Comment Deleted successfully")
      await fetchCommentsByBlog(blogId)
      return response?.data?.comment
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const approveComment = async (commentId, blogId) => {
    dispatch({type: "SET_LOADING"});
    try {
      const response = await axios.patch(`/api/comment/${commentId}/approve`, {},{
        headers: getAuthHeaders()
      })
      toast.success(response.data.message || "Comment Approved successfully")
      await fetchCommentsByBlog(blogId)
      return response?.data?.comment
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  useEffect(()=>{
    if(token) fetchUserComments();
  }, [token])

  const value = {
    ...state,
    fetchCommentsByBlog,
    fetchUserComments,
    addComment,
    updateComment,
    deleteComment,
    approveComment
  }
  return (
    <CommentsContext.Provider value={value}>
      {children}
    </CommentsContext.Provider>
  )
}

export default CommentsProvider