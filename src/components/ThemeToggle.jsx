import { useEffect, useState } from 'react'
import './ThemeToggle.css'

const PREF_KEY = 'theme'
const ORDER = ['light', 'dark', 'system']
const LABELS = { light: 'claro', dark: 'escuro', system: 'sistema' }

function getStoredPreference() {
  if (typeof localStorage === 'undefined') return 'system'
  const stored = localStorage.getItem(PREF_KEY)
  return stored === 'light' || stored === 'dark' || stored === 'system'
    ? stored
    : 'system'
}

function resolve(preference) {
  if (preference === 'light' || preference === 'dark') return preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function ThemeToggle() {
  const [preference, setPreference] = useState(getStoredPreference)

  useEffect(() => {
    const apply = () => {
      document.documentElement.setAttribute('data-theme', resolve(preference))
    }
    apply()
    try { localStorage.setItem(PREF_KEY, preference) } catch (e) {}

    if (preference !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => apply()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preference])

  const next = ORDER[(ORDER.indexOf(preference) + 1) % ORDER.length]

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle--${preference}`}
      onClick={() => setPreference(next)}
      aria-label={`Tema: ${LABELS[preference]}. Clique para usar tema ${LABELS[next]}.`}
      title={`Tema: ${LABELS[preference]}`}
    >
      <svg
        className="theme-toggle__icon theme-toggle__icon--sun"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4.2" fill="currentColor" />
        <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="2.5" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="21.5" />
          <line x1="2.5" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="21.5" y2="12" />
          <line x1="5.2" y1="5.2" x2="6.9" y2="6.9" />
          <line x1="17.1" y1="17.1" x2="18.8" y2="18.8" />
          <line x1="5.2" y1="18.8" x2="6.9" y2="17.1" />
          <line x1="17.1" y1="6.9" x2="18.8" y2="5.2" />
        </g>
      </svg>
      <svg
        className="theme-toggle__icon theme-toggle__icon--moon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <path
          d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="theme-toggle__icon theme-toggle__icon--system"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        aria-hidden="true"
      >
        <rect
          x="3" y="4"
          width="18" height="13"
          rx="2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <line
          x1="8" y1="20.5" x2="16" y2="20.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}
