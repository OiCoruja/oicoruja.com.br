import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Hero.css'

function Shape({ className }) {
  return <div className={`hero-shape ${className}`} aria-hidden="true" />
}

function readTheme() {
  if (typeof document === 'undefined') return 'light'
  return document.documentElement.getAttribute('data-theme') || 'light'
}

function useDataTheme() {
  const [theme, setTheme] = useState(readTheme)
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [])
  return theme
}

export default function Hero() {
  const sectionRef = useRef(null)
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const ctaRef = useRef(null)
  const badgeRef = useRef(null)
  const mascotRef = useRef(null)
  const theme = useDataTheme()
  const mascotSrc = theme === 'dark' ? '/mascot-salmon.png' : '/mascot.png'

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      const words = headlineRef.current.querySelectorAll('.word')
      tl.from(words, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })
      .from(subRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      }, '-=0.3')
      .from(ctaRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, '-=0.3')
      .from(badgeRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
      }, '-=0.4')
      .from(mascotRef.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.8')

      // Mascot gentle float + slight rock
      gsap.to(mascotRef.current, {
        y: -20,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to(mascotRef.current, {
        rotate: 4,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      })

      // Background shapes
      gsap.to('.hero-shape--circle', {
        y: -18,
        duration: 3.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.hero-shape--diamond', {
        y: -12,
        x: 8,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.8,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const headline = ['Comunicação', 'com', 'personalidade.']

  return (
    <section ref={sectionRef} className="hero" id="inicio">
      <Shape className="hero-shape--circle hero-shape--purple" />
      <Shape className="hero-shape--diamond hero-shape--salmon" />

      <div className="hero__inner">
        <div ref={badgeRef} className="hero__badge">
          <span className="hero__badge-dot" />
          Gestão de redes sociais &amp; publicidade
        </div>

        <h1 ref={headlineRef} className="hero__headline">
          {headline.map((word, i) => (
            <span key={i} className="word">
              {word}{' '}
            </span>
          ))}
        </h1>

        <p ref={subRef} className="hero__sub">
          A Coruja cuida das redes sociais e da publicidade da sua empresa
          para que você foque no que realmente importa.
        </p>

        <div ref={ctaRef} className="hero__actions">
          <a
            href="https://wa.me/5519998315115"
            target="_blank"
            rel="noreferrer"
            className="btn btn--primary"
          >
            Fale com a gente
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <a href="#servicos" className="btn btn--ghost">
            O que fazemos
          </a>
        </div>
      </div>

      <img
        ref={mascotRef}
        src={mascotSrc}
        alt="Corujinha — mascote da Coruja Comunicação"
        className="hero__mascot"
        width="1000"
        height="1012"
        loading="eager"
        fetchpriority="high"
      />

      <div className="hero__scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
