import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { loadScrollTrigger } from '../scrollTrigger'
import FloatingShapes from './FloatingShapes'
import './Sobre.css'

const SOBRE_SHAPES = [
  { type: 'circle',  color: 'purple',      size: '320px', top: '-40px',  left: '-80px', opacity: 0.08, speed: 4.2, delay: 0,   yDist: 18 },
  { type: 'diamond', color: 'salmon',      size: '90px',  top: '18%',    right: '6%',   opacity: 0.14, speed: 3.4, delay: 0.4, yDist: 14, rotAmt: 10 },
  { type: 'square',  color: 'purple-dark', size: '70px',  bottom: '12%', left: '8%',    opacity: 0.10, speed: 3.6, delay: 0.7, yDist: 12, rotAmt: -8 },
  { type: 'circle',  color: 'salmon',      size: '55px',  bottom: '22%', right: '14%',  opacity: 0.12, speed: 2.9, delay: 0.2, yDist: 10 },
]

export default function Sobre() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx
    let cancelled = false

    loadScrollTrigger().then(() => {
      if (cancelled) return
      ctx = gsap.context(() => {
        gsap.from('.sobre__header', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.sobre__header', start: 'top 85%' },
        })

        gsap.from('.sobre__lead', {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.sobre__lead', start: 'top 85%' },
        })

        gsap.from('.sobre__body p', {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.sobre__body', start: 'top 80%' },
        })
      }, sectionRef)
    })

    return () => {
      cancelled = true
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="sobre" id="sobre">
      <FloatingShapes shapes={SOBRE_SHAPES} />
      <div className="sobre__inner">
        <div className="sobre__header">
          <span className="section-label">Sobre a Coruja</span>
          <h2 className="section-title">
            Comunicação que <em>enxerga</em><br />
            além do óbvio.
          </h2>
        </div>

        <p className="sobre__lead">
          A coruja tem uma visão privilegiada, capaz de perceber detalhes que
          passam despercebidos para a maioria. Com audição aguçada, identifica
          oportunidades mesmo em meio ao ruído.
        </p>

        <div className="sobre__body">
          <p>
            Inspiradas nessa ave, duas amigas deram vida à Coruja Comunicação
            com um propósito: unir pessoas ao marketing consciente. Ao longo
            da nossa jornada profissional, entendemos o quanto as conexões
            que criamos e o relacionamento com as pessoas são importantes
            para uma comunicação de sucesso.
          </p>
          <p>
            Por trás de cada negócio, existe uma pessoa que sonhou e lutou
            para torná-lo real. São essas histórias que nos movem! Nós
            aprendemos a ouvir atentamente as dores dos nossos clientes e
            enxergar oportunidades que geram conexões reais e duradouras.
          </p>
          <p>
            Somos mais que uma agência! Há 7 anos, criamos e estruturamos
            uma empresa que oferece um trabalho autêntico e responsável. Nós
            prezamos pelas relações sociais e sabemos que hoje, mais do que
            nunca, o marketing é sobre pessoas. Por isso, nos conectamos à
            sua marca, para que ela se conecte com o público.
          </p>
          <p>
            Sabemos que estar presente nas redes sociais não é mais uma
            escolha, mas uma necessidade. E diante de tantos conteúdos e
            informações, saber se posicionar e mostrar o valor do seu
            produto é o que coloca o seu negócio em destaque no digital.
          </p>
        </div>
      </div>
    </section>
  )
}
