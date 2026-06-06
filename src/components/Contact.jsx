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
  { type: 'diamond', color: 'salmon', size: '70px', bottom: '18%', right: '8%',  opacity: 0.2, speed: 4.0, delay: 0.5, yDist: 16 },
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
      <path d="M17.47 14.38c-.297-.149-1.76-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.3-.767.97-.94 1.16-.173.2-.347.22-.644.08-.297-.15-1.25-.463-2.39-1.48-.883-.788-1.48-1.76-1.65-2.06-.173-.297-.018-.458.13-.606.13-.133.3-.347.45-.52.15-.174.2-.298.3-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.61-.916-2.21-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.07-.792.37-.272.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.88 1.21 3.07.149.2 2.1 3.2 5.08 4.49.709.31 1.26.489 1.69.625.71.227 1.36.2 1.87.118.57-.085 1.76-.719 2.01-1.41.248-.694.25-1.29.173-1.41-.074-.124-.272-.198-.57-.347m-5.42 7.4h-.004a9.87 9.87 0 01-5.03-1.38l-.361-.214-3.74.983-3.65-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 12.89 6.99c-.003 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.81 11.81 0 0012.05 0C5.5 0 .16 5.33.157 11.89c0 2.1.547 4.14 1.59 5.95L.057 24l6.3-1.65a11.88 11.88 0 5.68 1.45h.005c6.55 0 11.89-5.33 11.89-11.89a11.82 11.82 0 00-3.48-8.41z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.012 4.85.07 3.25.148 4.77 1.69 4.92 4.92.058 1.26.069 1.65.069 4.85 0 3.21-.012 3.58-.069 4.85-.149 3.23-1.66 4.77-4.92 4.92-1.27.058-1.64.07-4.85.07-3.2 0-3.58-.012-4.85-.07-3.26-.149-4.77-1.7-4.92-4.92-.058-1.26-.07-1.64-.07-4.85 0-3.2.013-3.58.07-4.85.149-3.23 1.66-4.77 4.92-4.92 1.27-.057 1.65-.069 4.85-.069zM12 0C8.74 0 8.33.014 7.05.072 2.69.272.27 2.69.07 7.05.014 8.33 0 8.74 0 12c0 3.26.014 3.67.072 4.95.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24c3.26 0 3.67-.014 4.95-.072 4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.073-4.95 0-3.26-.014-3.67-.072-4.95-.196-4.35-2.62-6.78-6.98-6.98C15.67.014 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z"/>
    </svg>
  )
}
