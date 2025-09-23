import { useContext } from "react"
import { DashboardContext } from "../context/DashboardContext";


export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if(!context){
    throw Error(`useDashboardContext must be used inside a DashboardContextProvider`)
  }
  return context;
}