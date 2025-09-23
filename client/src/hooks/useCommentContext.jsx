import { useContext } from "react"
import { CommentsContext } from "../context/CommentContext";


export const useCommentContext = () => {
  const context = useContext(CommentsContext);
  if(!context){
    throw Error(`useCommentContext must be used inside a CommentContextProvider`)
  }
  return context;
}