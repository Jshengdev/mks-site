import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import ProfessionalSite from './site/ProfessionalSite.jsx'

// Lazy-load the entire WebGL experience — zero Three.js on the professional site
const ExperienceApp = lazy(() => import('./App.jsx'))

function ExperienceLoader() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#c8d4e8',
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '1.2rem',
        opacity: 0.5
      }}>
        Loading experience…
      </div>
    }>
      <ExperienceApp />
    </Suspense>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProfessionalSite />} />
        <Route path="/experience/*" element={<ExperienceLoader />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
