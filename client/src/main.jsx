import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import {Toaster} from 'react-hot-toast'
import BlogProvider from './context/BlogContext.jsx'
import { AppProvider } from './context/AppProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProvider>
        <App />
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {style: {background: '#16a34a' }},
          error: {style: { background: '#dc2626' }}
        }} />
    </AppProvider>
  </StrictMode>,
)
