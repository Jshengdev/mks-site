// WorldNav — minimal fixed navigation for switching between environment worlds
// Design: invisible until needed, serif typography, opacity-only transitions
import { NavLink, useLocation } from 'react-router-dom'
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
  const location = useLocation()

  return (
    <nav className="world-nav" aria-label="Environment navigation">
      <ul className="world-nav__list">
        {ENV_ORDER.map(envId => {
          const env = ENVIRONMENTS[envId]
          const isActive = location.pathname === env.route
          return (
            <li key={envId} className="world-nav__item">
              <NavLink
                to={env.route}
                className={`world-nav__link ${isActive ? 'world-nav__link--active' : ''}`}
                style={{
                  '--env-color': env.dominantColor,
                }}
              >
                {NAV_LABELS[envId]}
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
