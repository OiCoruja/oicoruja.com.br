import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { loadScrollTrigger } from '../scrollTrigger'
import FloatingShapes from './FloatingShapes'
import './Contact.css'

// Web3Forms access key — public by design (ships in the bundle).
// Get it from web3forms.com after verifying your email.
const WEB3FORMS_ACCESS_KEY = '59fb0cc6-ce80-435e-aa17-431df3c7b2b7'
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'

const CONTACT_SHAPES = [
  { type: 'square',  color: 'white',  size: '80px', top: '12%',    left: '6%',   opacity: 0.08, speed: 3.5, delay: 0,   yDist: 14, rotAmt: 10 },
  { type: 'diamond', color: 'salmon', size: '70px', bottom: '18%', right: '8%',  opacity: 0.20, speed: 4.0, delay: 0.5, yDist: 16 },
  { type: 'circle',  color: 'white',  size: '50px', top: '55%',    left: '3%',   opacity: 0.08, speed: 3.0, delay: 0.3, yDist: 12 },
  { type: 'square',  color: 'salmon', size: '45px', top: '20%',    right: '12%', opacity: 0.18, speed: 2.8, delay: 0.7, yDist: 10, rotAmt: -8 },
  { type: 'diamond', color: 'white',  size: '55px', bottom: '10%', left: '15%',  opacity: 0.08, speed: 3.8, delay: 0.2, yDist: 14, rotAmt: 6 },
]

export default function Contact() {
  const sectionRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error

  // Defer Web3Forms' client script until the section is near the viewport.
  // The script renders the hCaptcha widget inside `.h-captcha[data-captcha="true"]`
  // and loads hCaptcha with ?recaptchacompat=off — required for free-tier
  // validation (no g-recaptcha-response field).
  useEffect(() => {
    const loadW3F = () => {
      if (document.getElementById('w3f-client-script')) return
      const script = document.createElement('script')
      script.id = 'w3f-client-script'
      script.src = 'https://web3forms.com/client/script.js'
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }

    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) {
        loadW3F()
        io.disconnect()
      }
    }, { rootMargin: '400px' })
    io.observe(sectionRef.current)

    return () => io.disconnect()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'submitting') return
    const form = e.currentTarget
    setStatus('submitting')
    try {
      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.success) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ctx
    let cancelled = false

    loadScrollTrigger().then(() => {
      if (cancelled) return
      ctx = gsap.context(() => {
        gsap.from('.contact__content > *', {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        })

        // Floating blobs
        gsap.to('.contact__blob--1', {
          x: 20,
          y: -20,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
        gsap.to('.contact__blob--2', {
          x: -15,
          y: 15,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5,
        })
      }, sectionRef)
    })

    return () => {
      cancelled = true
      if (ctx) ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="contact" id="contato">
      <div className="contact__blob contact__blob--1" aria-hidden="true" />
      <div className="contact__blob contact__blob--2" aria-hidden="true" />
      <FloatingShapes shapes={CONTACT_SHAPES} />

      <div className="contact__content">
        <span className="section-label contact__label">Contato</span>
        <h2 className="contact__title">
          Bora trabalhar<br />juntos?
        </h2>
        <p className="contact__sub">
          Conte para a gente sobre a sua marca. A Coruja vai te ajudar
          a crescer no digital com estratégia e muita personalidade.
        </p>

        <div className="contact__actions">
          <a
            href="https://wa.me/5519998315115"
            target="_blank"
            rel="noreferrer"
            className="contact__btn contact__btn--whatsapp"
          >
            <WhatsAppIcon />
            Falar no WhatsApp
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
          <a
            href="https://www.instagram.com/coruja.comunicacao"
            target="_blank"
            rel="noreferrer"
            className="contact__btn contact__btn--instagram"
          >
            <InstagramIcon />
            Ver no Instagram
            <span className="sr-only"> (abre em nova aba)</span>
          </a>
        </div>

        <form
          className="contact__form"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={status === 'submitting'}
        >
          <p className="contact__form-intro">
            Prefere nos mandar uma mensagem? Conte um pouquinho sobre o seu projeto.
          </p>

          <div className="contact__form-row">
            <div className="contact__field">
              <label htmlFor="contact-name">Nome</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                autoComplete="name"
              />
            </div>
            <div className="contact__field">
              <label htmlFor="contact-email">E-mail</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="contact__field">
            <label htmlFor="contact-message">Mensagem</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              required
            />
          </div>

          <div className="contact__captcha">
            <div className="h-captcha" data-captcha="true" />
          </div>

          <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
          <input type="hidden" name="subject" value="Nova mensagem do site oicoruja.com.br" />
          <input type="hidden" name="from_name" value="oicoruja.com.br" />

          <button
            type="submit"
            className="contact__form-submit"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Enviando…' : 'Enviar mensagem'}
          </button>

          <p
            className={`contact__form-status contact__form-status--${status}`}
            role="status"
            aria-live="polite"
          >
            {status === 'success' && 'Mensagem enviada! A gente entra em contato em breve.'}
            {status === 'error' && 'Algo deu errado. Tente de novo ou use o WhatsApp acima.'}
          </p>
        </form>

        <p className="contact__email">
          Ou direto para{' '}
          <a href="mailto:corujaccomunicacao@gmail.com">corujaccomunicacao@gmail.com</a>
        </p>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}
