import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import './styles/global.css'
import { AuthProvider } from './context/AuthContext.jsx';
import ChatWidget from './Components/Chatbot/ChatWidget.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-root">
          <Navbar />
          <AppRoutes />
          <Footer />
          <ChatWidget />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
