import { createContext, useReducer } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import toast from "react-hot-toast"


const initialState = {
  users: [],
  profile: null,
  loading: false,
  error: ""
}

const userReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {...state, loading: action.payload ?? true, error: ""}
    case "SET_USERS":
      return {...state, users: action.payload, loading: false, error: ""}
    case "SET_PROFILE":
      return {...state, profile: action.payload, loading: false, error: ""}
    case "CLEAR_PROFILE":
      return {...state, profile: null}
    case "SET_ERROR":
      return {...state, error: action.payload, loading: false}
  
    default:
      return state
  }
}

export const UserContext = createContext()

export const UserProvider = ({children}) => {

  const [state, dispatch] = useReducer(userReducer, initialState)
  const {axios, token} = useAuthContext()
  const getAuthHeader = () => token ? {Authorization: `Bearer ${token}`} : {};

  const handleError = (error, fallback = "Something went wrong") => {
    const message = error.response?.data?.message || error.message || fallback
    toast.error(message)
    return message
  }

  const fetchAllUsers = async () => {
    dispatch({type: "SET_LOADING", payload: true})
    try {
      const response = await axios.get('/api/user',{
        headers: getAuthHeader()
      })
      dispatch({type: "SET_USERS", payload: response?.data?.users, })
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const fetchProfile = async () => {
    dispatch({type: "SET_LOADING", payload: true})
    try {
      const response = await axios.get(`/api/user/profile`, {
        headers: getAuthHeader()
      })
      dispatch({type: "SET_PROFILE", payload: response.data.user})
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const updateUser = async (id, data) => {
    dispatch({type: "SET_LOADING", payload: true})
    try {
      const response = await axios.patch(`/api/user/update/${id}`, data,{
        headers: { "Content-Type": "application/json",  ...getAuthHeader},

      })
      toast.success("User updated successfully")
      if(state.profile._id === id) dispatch({type: "SET_PROFILE", payload: response.data.user})
      await fetchAllUsers()
      dispatch({type: "SET_LOADING", payload: false})
      return response.data.user
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  const deleteUser = async (id) => {
    dispatch({type: "SET_LOADING", payload: true})
    try {
      const response = await axios.delete(`/api/user/delete/${id}`, {
        headers: getAuthHeader(),
      })
      toast.success("User Deleted Successfully")
      if(state.profile?._id === id) dispatch({ type: "CLEAR_PROFILE" })
      await fetchAllUsers()
      dispatch({type: "SET_LOADING", payload: false})
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  return (
    <UserContext.Provider value={{...state, fetchAllUsers, updateUser, deleteUser, fetchProfile}}>
      {children}
    </UserContext.Provider>
  )
}