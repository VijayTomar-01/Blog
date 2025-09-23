import { AuthProvider } from "./AuthContext"
import BlogProvider from "./BlogContext"
import CommentsProvider from "./CommentContext"
import { DashboardProvider } from "./DashboardContext"
import { UserProvider } from "./UserContext"


export const AppProvider = ({children}) => {

  return (
    <AuthProvider>
      <UserProvider>
        <DashboardProvider>
          <BlogProvider>
            <CommentsProvider>
              {children}
            </CommentsProvider>
          </BlogProvider>
        </DashboardProvider>
      </UserProvider>
    </AuthProvider>
  )
}