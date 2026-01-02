import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'

// Lazy load pages for better performance
const Privacy = lazy(() => import('./pages/Privacy'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Articles = lazy(() => import('./pages/Articles'))
const Reviews = lazy(() => import('./pages/Reviews'))

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    color: '#d4af37',
    fontSize: '18px'
  }}>
    جاري التحميل...
  </div>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/privacy" element={<Privacy/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/articles" element={<Articles/>} />
          <Route path="/reviews" element={<Reviews/>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
