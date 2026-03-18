// App — Music-driven, no URL routing
// WorldContext drives which environment is active.
// MiniPlayer is the navigation. Entry page gates everything.
import { WorldProvider, useWorld } from './WorldContext.jsx'
import EnvironmentScene from './EnvironmentScene.jsx'
import MiniPlayer from './MiniPlayer.jsx'
import MoonlightCursor from './MoonlightCursor.jsx'
import WorldNav from './WorldNav.jsx'
import EntryPage from './entry/EntryPage.jsx'
import SiteLinks from './SiteLinks.jsx'

function AppInner() {
  const { entryComplete, currentWorld } = useWorld()

  if (!entryComplete) {
    return <EntryPage />
  }

  return (
    <>
      <EnvironmentScene envId={currentWorld} />
      <WorldNav />
      <MiniPlayer />
      <MoonlightCursor />
    </>
  )
}

function App() {
  return (
    <WorldProvider>
      <SiteLinks />
      <AppInner />
    </WorldProvider>
  )
}

export default App
