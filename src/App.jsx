import { Routes, Route } from 'react-router-dom'
import EnvironmentScene from './EnvironmentScene.jsx'
import MiniPlayer from './MiniPlayer.jsx'
import MoonlightCursor from './MoonlightCursor.jsx'
import WorldNav from './WorldNav.jsx'
import { ENVIRONMENTS } from './environments/index.js'

function App() {
  return (
    <>
      {/* Routes — each environment is a full-screen 3D world */}
      <Routes>
        {Object.values(ENVIRONMENTS).map(env => (
          <Route
            key={env.id}
            path={env.route}
            element={<EnvironmentScene envId={env.id} />}
          />
        ))}
      </Routes>

      {/* Persistent across all routes */}
      <WorldNav />
      <MiniPlayer />
      <MoonlightCursor />
    </>
  )
}

export default App
