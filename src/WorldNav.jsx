// WorldNav — minimal fixed navigation for switching between environment worlds
// Design: invisible until needed, serif typography, opacity-only transitions
// Now driven by WorldContext, not URL routing
import { useWorld } from './WorldContext.jsx'
import { ENV_ORDER, ENVIRONMENTS } from './environments/index.js'
import './WorldNav.css'

// Short display labels for nav — evocative, not descriptive
const NAV_LABELS = {
  'golden-meadow': 'Enter',
  'ocean-cliff': 'Listen',
  'night-meadow': 'Story',
  'ghibli-painterly': 'Collect',
  'storm-field': 'Witness',
}

export default function WorldNav() {
  const { currentWorld, navigateToWorld } = useWorld()

  return (
    <nav className="world-nav" aria-label="Environment navigation">
      <ul className="world-nav__list">
        {ENV_ORDER.map(envId => {
          const env = ENVIRONMENTS[envId]
          const isActive = currentWorld === envId
          return (
            <li key={envId} className="world-nav__item">
              <button
                className={`world-nav__link ${isActive ? 'world-nav__link--active' : ''}`}
                style={{ '--env-color': env.dominantColor }}
                onClick={() => navigateToWorld(envId)}
              >
                {NAV_LABELS[envId]}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
