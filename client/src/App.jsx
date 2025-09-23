import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import BlogDetails from './pages/BlogDetails'
import ProtectedRoute from './components/Helper/ProtectedRoute'
import DashboardLayout from './pages/Dashboard/DashboardLayout'
import Dashboard from './pages/Dashboard/Dashboard'
import CreateBlog from './pages/Dashboard/CreateBlog'
import ManageComments from './pages/Dashboard/ManageComments'
import Profile from './pages/Dashboard/Profile'
import ManageUsers from './pages/Dashboard/ManageUsers'
import 'quill/dist/quill.snow.css'
import ManageBlog from './pages/Dashboard/ManageBlog'
import EditBlog from './components/Dashboard/EditBlog'


function App() {

  return (
    <BrowserRouter>
     <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/signup' element={<Signup/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/blog/:id' element={<BlogDetails/>}/>

      <Route element={<ProtectedRoute/>}>
        <Route path='/dashboard' element={<DashboardLayout/>}>
          <Route index element={<Dashboard/>}/>
          <Route path='create-blog' element={<CreateBlog/>}/>
          <Route path='manage-comments' element={<ManageComments/>} />
          <Route path='profile' element={<Profile/>} />
          <Route path='manage-blog' element={<ManageBlog/>}/>
          <Route path='edit-blog/:id' element={<EditBlog/>} />

          <Route element={<ProtectedRoute role="admin"/>}>
            <Route path='manage-users' element={<ManageUsers/>}/>
          </Route>
        </Route>
      </Route>
     </Routes>
    </BrowserRouter>
  )
}

export default App
