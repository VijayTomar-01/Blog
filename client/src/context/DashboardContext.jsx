import { createContext, useEffect, useReducer } from "react"
import { useAuthContext } from "../hooks/useAuthContext"
import toast from "react-hot-toast"


const initialState = {
  dashboard: null,
  loading: false,
  error: "",
}

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return {...state, loading: true, error: ""}
    case "SET_DASHBOARD":
      return {...state, dashboard: action.payload, loading: false, error: ""}
    case "SET_ERROR":
      return {...state, loading: false, error: action.payload}
    
    default:
      return state
  }
}

export const DashboardContext = createContext()

export const DashboardProvider = ({children}) => {

  const [state, dispatch] = useReducer(dashboardReducer, initialState)
  const {axios, token} = useAuthContext()
  const getAuthHeaders = () => token ? {Authorization : `Bearer ${token}`} : {};

  const handleError = (error, fallback = "Something went wrong") => {
    const message = error.response?.data?.message || error.message || fallback;
    toast.error(message);
    return message;
  };

  const fetchDashboard = async () => {
    dispatch({type: "SET_LOADING"})
    try {
      const response = await axios.get('/api/dashboard', {
        headers: getAuthHeaders()
      })
      dispatch({type: "SET_DASHBOARD", payload: response?.data?.dashboard})
    } catch (error) {
      const msg = handleError(error)
      dispatch({type: "SET_ERROR", payload: msg})
    }
  }

  useEffect(()=>{
    if(token)fetchDashboard()
  }, [token])

  return(
    <DashboardContext.Provider value={{...state, fetchDashboard}}>
      {children}
    </DashboardContext.Provider>
  )
}