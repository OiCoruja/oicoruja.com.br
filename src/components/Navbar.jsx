import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

export default function Navbar() {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.from(navRef.current, {
          y: -80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          delay: 0.2,
        })
      }
    }, navRef)

    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => {
      ctx.revert()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const links = [
    { label: 'Serviços', href: '#servicos' },
    { label: 'Portfólio', href: '#portfolio' },
    { label: 'Contato', href: '#contato' },
  ]

  return (
    <nav ref={navRef} className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <a href="#" className="navbar__logo">coruja</a>

      <ul
        id="navbar-menu"
        className={`navbar__links${menuOpen ? ' navbar__links--open' : ''}`}
      >
        {links.map(({ label, href }) => (
          <li key={href}>
            <a href={href} onClick={() => setMenuOpen(false)}>{label}</a>
          </li>
        ))}
        <li>
          <a
            href="#contato"
            className="navbar__cta"
            onClick={() => setMenuOpen(false)}
          >
            Fale com a gente
          </a>
        </li>
      </ul>

      <div className="navbar__controls">
        <ThemeToggle />
        <button
          className={`navbar__burger${menuOpen ? ' navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
