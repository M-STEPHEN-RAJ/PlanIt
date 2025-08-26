import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { SidebarProvider } from './Context/SidebarContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </BrowserRouter>,
)
