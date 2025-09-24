import axios from 'axios'
import { createContext, useEffect, useReducer } from 'react';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
// axios.defaults.baseURL = "http://localhost:4000"

// axios.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token")
//   if(token){
//     config.headers.Authorization =  `Bearer ${token}`;
//   }
//   return config;
// })

export const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOGIN":
      return {...state, user: action.payload.user, token: action.payload.token};
    case "SET_LOGOUT":
      return {...state, user: null, token: null};
    case "SET_LOADING":
      return {...state, loading: action.payload};
  
    default:
      return state;
  }
} 

export const AuthProvider = ({children})=>{

  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(()=>{
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if(storedToken && storedUser){
      dispatch({
        type: "SET_LOGIN",
        payload: {
          user: JSON.parse(storedUser),
          token: storedToken
        }
      })
      console.log("Restored user:", storedUser);
      dispatch({type: "SET_LOADING", payload: false});
    } else {
      dispatch({type: "SET_LOADING", payload: false});
    }
  }, [])

  // Login function
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    dispatch({type: "SET_LOGIN", payload: {user: userData, token}});
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token")
    dispatch({type: "SET_LOGOUT"})
  }

  return(
    <AuthContext.Provider value={{axios, login, logout, ...state}}>
      {children}
    </AuthContext.Provider>
  )
}