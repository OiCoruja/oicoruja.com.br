import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import FloatingShapes from './FloatingShapes'
import './Portfolio.css'

const PORTFOLIO_SHAPES = [
  { type: 'diamond', color: 'purple', size: '90px',  top: '8%',       left: '2%',     opacity: 0.14, speed: 3.8, delay: 0,   yDist: 16, rotAmt: 10 },
  { type: 'circle',  color: 'salmon', size: '260px', bottom: '-60px', right: '-40px', opacity: 0.12, speed: 4.2, delay: 0.4, yDist: 18 },
  { type: 'square',  color: 'purple', size: '65px',  top: '45%',      left: '1%',     opacity: 0.10, speed: 3.0, delay: 0.7, yDist: 12, rotAmt: -6 },
  { type: 'diamond', color: 'salmon', size: '55px',  top: '12%',      right: '6%',    opacity: 0.16, speed: 3.5, delay: 0.2, yDist: 14 },
  { type: 'circle',  color: 'purple', size: '45px',  bottom: '15%',   left: '12%',    opacity: 0.12, speed: 2.8, delay: 0.9, yDist: 10 },
]

// Curated pool of Instagram post IDs — site picks 6 at random on each page load.
// To add a new post, paste the ID from instagram.com/p/<ID>/ into this array.
const POST_POOL = [
  'DYDNCeUt7Va',
  'DYHmucSgii3',
  'DX-Dj2fkSGh',
  'DX-IX-dkzQ2',
  'DXwodaSNKtP',
  'DXuDAjDj_ti',
  'DXuqNPKD3ty',
  'DXu0jB1JB-q',
  'DXj3sqfDUFq',
  'DXj1usRjRsz',
  'DXjvDRaDZ0u',
  'DXPwrdShkwf',
  'DXPRy4zBvh2',
  'DXeTDTWBMCu',
  'DXaD3K4h6Cy',
  'DW9uGXkTK0y',
  'DXU9uSMhBl0',
  'DXXibgEDeIC',
  'DXPEBzZkayk',
  'DXbuPaBDIJA',
  'DXcwJY3CV-i',
]

const PICK_COUNT = 6

function pickRandom(arr, n) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}

export default function Portfolio() {
  const sectionRef = useRef(null)
  // Lazy initializer — shuffle runs exactly once per mount, not on every render
  const [posts] = useState(() => pickRandom(POST_POOL, PICK_COUNT))

  useEffect(() => {
    // Defer Instagram's embed.js until the section is near the viewport —
    // the script is heavy and Portfolio sits below the fold.
    const loadIgEmbed = () => {
      if (document.getElementById('ig-embed-script')) {
        if (window.instgrm) window.instgrm.Embeds.process()
        return
      }
      const script = document.createElement('script')
      script.id = 'ig-embed-script'
      script.src = 'https://www.instagram.com/embed.js'
      script.async = true
      script.onload = () => {
        if (window.instgrm) window.instgrm.Embeds.process()
      }
      document.body.appendChild(script)
    }

    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        loadIgEmbed()
        io.disconnect()
      }
    }, { rootMargin: '400px' })
    io.observe(sectionRef.current)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return () => io.disconnect()
    }

    const ctx = gsap.context(() => {
      gsap.from('.portfolio__header', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.portfolio__header',
          start: 'top 85%',
        },
      })

      gsap.from('.portfolio-embed', {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.portfolio__grid',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => {
      io.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="portfolio" id="portfolio">
      <FloatingShapes shapes={PORTFOLIO_SHAPES} />
      <div className="portfolio__inner">
        <div className="portfolio__header">
          <span className="section-label">Portfólio</span>
          <h2 className="section-title">
            O que a gente faz<br />
            <em>fala por si</em>.
          </h2>
          <p className="section-sub">
            Uma seleção do nosso trabalho direto do Instagram —
            estratégia e criatividade na prática.
          </p>
        </div>

        <div className="portfolio__grid">
          {posts.map((id) => (
            <div key={id} className="portfolio-embed">
              <blockquote
                className="instagram-media"
                data-instgrm-captioned
                data-instgrm-permalink={`https://www.instagram.com/p/${id}/`}
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: '0',
                  borderRadius: '20px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                  margin: '0',
                  maxWidth: '100%',
                  minWidth: '326px',
                  padding: '0',
                  width: '100%',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
