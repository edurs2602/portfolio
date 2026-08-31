import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import './i18n'
import Nav from './components/nav/Nav'
import Banner from './components/banner/Banner'
import About from './components/about/About'
import Exp from './components/exp/Experiencias'
import Projects from './components/projects/Projects'
import Skills from './components/skills/Skills'
import Contact from './components/contact/Contact'
import Footer from './components/footer/Footer'
import AdminLayout from './admin/AdminLayout'
import LoginPage from './admin/LoginPage'
import ProtectedRoute from './admin/ProtectedRoute'

function Portfolio() {
  const [isLight, setIsLight] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'light') {
      setIsLight(true)
      document.body.classList.add('light')
    }
  }, [])

  const toggleTheme = () => {
    setIsLight(!isLight)
    document.body.classList.toggle('light')
    localStorage.setItem('theme', !isLight ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen">
      <Nav toggleTheme={toggleTheme} isLight={isLight} />
      <main>
        <section id="Home"><Banner /></section>
        <section id="About"><About /></section>
        <section id="Experience"><Exp /></section>
        <section id="Projects"><Projects /></section>
        <section id="Skills"><Skills /></section>
        <section id="Contact"><Contact /></section>
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
