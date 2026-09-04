import React, { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Shop from './pages/Shop'
import Checkout from './pages/Checkout'
import About from './pages/About'
import Journal from './pages/Journal'
import JournalPost from './pages/JournalPost'
import SignIn from './pages/SignIn'
import SignUp from './pages/Signup'
import Contact from './pages/Contact'
import OAuthSuccess from './pages/OAuthSuccess'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Profile from './pages/Profile'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  const location = useLocation()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.2,
      lerp: 0.1,
    })

    window.lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const update = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
      window.lenis = null
    }
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh()

      if (window.lenis) {
        window.lenis.scrollTo(0, { immediate: false, duration: 1.0 })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    })

    return () => cancelAnimationFrame(frame)
  }, [location.pathname])

  // A logout does a hard page refresh (window.location.href), which wipes
  // any toast that was on screen. So the Navbar stashes the message in
  // sessionStorage right before reloading, and this fires it once the
  // fresh page has mounted, then clears the flag so it doesn't repeat.
  useEffect(() => {
    const pendingMessage = sessionStorage.getItem('logoutMessage')
    if (pendingMessage) {
      toast.success(pendingMessage)
      sessionStorage.removeItem('logoutMessage')
    }
  }, [])

  return (
    <div>
      <ToastContainer position="top-right" theme="dark" autoClose={3000} />

      <Navbar />

      <main className=''>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/journal/:slug" element={<JournalPost />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App
