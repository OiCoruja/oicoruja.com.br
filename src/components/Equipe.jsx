import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { loadScrollTrigger } from '../scrollTrigger'
import FloatingShapes from './FloatingShapes'
import './Equipe.css'

const EQUIPE_SHAPES = [
  { type: 'circle',  color: 'salmon',      size: '300px', top: '-60px',  right: '-80px', opacity: 0.08, speed: 4.0, delay: 0,   yDist: 18 },
  { type: 'diamond', color: 'purple',      size: '80px',  top: '12%',    left: '4%',     opacity: 0.13, speed: 3.6, delay: 0.4, yDist: 14, rotAmt: 8 },
  { type: 'square',  color: 'purple-dark', size: '60px',  bottom: '15%', right: '8%',    opacity: 0.10, speed: 3.2, delay: 0.7, yDist: 12, rotAmt: -10 },
]

const team = [
  {
    name: 'Ana Clara',
    accent: 'var(--purple)',
    bio: (
      <>
        <p>Prazer, sou a Ana Clara, mas pode me chamar de Ana!</p>
        <p>
          Formada em Jornalismo pela PUC Campinas, com MBA em Digital
          Business, sou apaixonada por livros, viagens e estou sempre com
          uma xícara de café na mão.
        </p>
        <p>
          Com a Coruja, me aproximo de cada cliente para conhecer novas
          histórias e deixo a imaginação voar longe para criar conteúdos
          e oportunidades.
        </p>
      </>
    ),
  },
  {
    name: 'Bianca',
    accent: 'var(--salmon)',
    bio: (
      <>
        <p>Oi, eu sou a Bianca, mas pode chamar de Bi, Bibis ou Bic.</p>
        <p>
          Formada em Jornalismo pelo Unasp/EC, sou apaixonada pela beleza
          da simplicidade da vida e das pequenas grandes coisas: como
          comida bem-feita, cozinhar, cheiro de limpeza e temperos na
          panela, cafés superfaturados, ou não.
        </p>
        <p>
          Uma das coisas que me move na Coruja é cultivar as pessoas —
          temos clientes que viraram amigos e amo cada um com suas
          singularidades.
        </p>
      </>
    ),
  },
  {
    name: 'Filipe',
    accent: 'var(--purple-dark)',
    bio: (
      <>
        <p>Aoba, eu sou o Filipe, a terça parte da Coruja.</p>
        <p>
          Administrador e financeiro, empreendedor, maluco por café e pão
          de queijo e aventureiro no audiovisual. Gosto de ver as coisas
          sempre bonitas, organizadas e de um jeito que eu gostaria que
          os clientes vissem se o negócio fosse meu. Acredito em negócios
          com “alma”, que propiciam momentos de qualidade e experiências
          positivas para as pessoas, e acredito que a venda é a última
          parte de algo muito maior — afinal, o que realmente construímos
          é o relacionamento, que é mais importante do que a negociação
          (mas dinheiro também é bom hein rs).
        </p>
        <p>
          Enfim, faço um monte de coisas diferentes, sempre busco sarna
          pra me coçar e estou sempre pronto para jogar uma conversa fora
          e tirar fotos bonitas e gravar vídeos com assinatura.
        </p>
        <p>
          O que mais me encanta na Coruja é poder transformar a forma
          como nossos clientes são vistos, criando uma relação de
          confiança em toda a cadeia de relacionamento, potencializando
          clientes nos quais realmente gostamos e acreditamos.
        </p>
      </>
    ),
  },
]

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

export default function Equipe() {
  const sectionRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx
    let cancelled = false

    loadScrollTrigger().then(() => {
      if (cancelled) return
      ctx = gsap.context(() => {
        gsap.from('.equipe__header', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.equipe__header', start: 'top 85%' },
        })

        gsap.from('.equipe__intro', {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.equipe__intro', start: 'top 85%' },
        })

        gsap.from('.equipe-card', {
          y: 60,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.equipe__grid', start: 'top 80%' },
        })
      }, sectionRef)
    })

    return () => {
      cancelled = true
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="equipe" id="equipe">
      <FloatingShapes shapes={EQUIPE_SHAPES} />
      <div className="equipe__inner">
        <div className="equipe__header">
          <span className="section-label">Quem somos</span>
          <h2 className="section-title">
            As pessoas por trás<br />
            da <em>Coruja</em>.
          </h2>
        </div>

        <p className="equipe__intro">
          Por trás da Coruja, existem três pessoas apaixonadas por transformar
          ideias em resultados: Ana Clara, Bianca e Filipe. Juntos, unimos o
          amor pela comunicação, tecnologia e criatividade para fazer o seu
          negócio criar asas e voar cada vez mais alto.
        </p>

        <div className="equipe__grid">
          {team.map(({ name, accent, bio }) => (
            <article
              key={name}
              className="equipe-card"
              style={{ '--card-accent': accent }}
            >
              <div className="equipe-card__profile">
                <div className="equipe-card__avatar" aria-hidden="true">
                  {initials(name)}
                </div>
                <h3 className="equipe-card__name">{name}</h3>
              </div>
              <div className="equipe-card__bio">{bio}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
