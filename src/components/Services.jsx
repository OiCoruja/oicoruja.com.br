import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { loadScrollTrigger } from '../scrollTrigger'
import FloatingShapes from './FloatingShapes'
import './Services.css'

const SERVICES_SHAPES = [
  { type: 'circle',  color: 'purple',      size: '340px', top: '-80px',  right: '-60px', opacity: 0.07, speed: 4.0, delay: 0,   yDist: 20 },
  { type: 'square',  color: 'salmon',      size: '100px', bottom: '10%', left: '3%',     opacity: 0.15, speed: 3.2, delay: 0.3, yDist: 14, rotAmt: 12 },
  { type: 'diamond', color: 'purple-dark', size: '70px',  top: '20%',    right: '5%',    opacity: 0.12, speed: 3.8, delay: 0.6, yDist: 18 },
  { type: 'circle',  color: 'salmon',      size: '60px',  bottom: '20%', right: '18%',   opacity: 0.13, speed: 2.9, delay: 0.2, yDist: 10 },
  { type: 'square',  color: 'purple',      size: '50px',  top: '15%',    left: '8%',     opacity: 0.10, speed: 3.5, delay: 0.8, yDist: 12, rotAmt: -8 },
]

const services = [
  {
    icon: '📱',
    title: 'Gestão de Redes Sociais',
    desc: 'Planejamento, criação e publicação de conteúdo no Instagram, Facebook, TikTok e LinkedIn com estratégia e consistência.',
    color: 'var(--purple)',
    textColor: 'var(--white)',
  },
  {
    icon: '🎨',
    title: 'Criação de Conteúdo',
    desc: 'Design, copy e produção de vídeos pensados para gerar engajamento e converter seguidores em clientes.',
    color: 'var(--salmon)',
    textColor: 'var(--black)',
  },
  {
    icon: '🎯',
    title: 'Tráfego Pago',
    desc: 'Campanhas no Meta Ads e Google Ads otimizadas para alcançar o público certo e maximizar seu retorno.',
    color: 'var(--pink)',
    textColor: 'var(--white)',
  },
  {
    icon: '📊',
    title: 'Estratégia Digital',
    desc: 'Diagnóstico, posicionamento e plano de ação para sua marca crescer com propósito no ambiente digital.',
    color: 'var(--purple-dark)',
    textColor: 'var(--white)',
  },
  {
    icon: '✏️',
    title: 'Identidade Visual',
    desc: 'Criação e refinamento de identidade visual coerente com a personalidade da sua marca e do seu público.',
    color: 'var(--green)',
    textColor: 'var(--black)',
  },
  {
    icon: '💡',
    title: 'Consultoria & Branding',
    desc: 'Análise profunda do posicionamento da sua marca e orientação estratégica para tomadas de decisão mais assertivas.',
    color: 'var(--black)',
    textColor: 'var(--white)',
  },
]

export default function Services() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx
    let cancelled = false

    loadScrollTrigger().then(() => {
      if (cancelled) return
      ctx = gsap.context(() => {
        gsap.from('.services__header', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services__header',
            start: 'top 85%',
          },
        })

        gsap.from('.service-card', {
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services__grid',
            start: 'top 80%',
          },
        })
      }, sectionRef)
    })

    return () => {
      cancelled = true
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="services" id="servicos">
      <FloatingShapes shapes={SERVICES_SHAPES} />
      <div className="services__inner">
        <div className="services__header">
          <span className="section-label">O que fazemos</span>
          <h2 className="section-title">
            Tudo o que a sua marca<br />
            precisa para <em>crescer</em>.
          </h2>
          <p className="section-sub">
            Da estratégia à execução, a Coruja cuida de cada detalhe
            da sua presença digital.
          </p>
        </div>

        <div className="services__grid">
          {services.map(({ icon, title, desc, color, textColor }) => (
            <article
              key={title}
              className="service-card"
              style={{ '--card-bg': color, '--card-text': textColor }}
            >
              <span className="service-card__icon">{icon}</span>
              <h3 className="service-card__title">{title}</h3>
              <p className="service-card__desc">{desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
