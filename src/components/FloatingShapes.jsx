import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './FloatingShapes.css'

// Each shape: { type, color, size, top, left, right, bottom, rotate, opacity, speed, delay }
export default function FloatingShapes({ shapes, trigger }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const els = containerRef.current.querySelectorAll('.fs')

      els.forEach((el) => {
        const speed   = parseFloat(el.dataset.speed)   || 3.5
        const delay   = parseFloat(el.dataset.delay)   || 0
        const yDist   = parseFloat(el.dataset.ydist)   || 16
        const xDist   = parseFloat(el.dataset.xdist)   || 0
        const rotAmt  = parseFloat(el.dataset.rotamt)  || 0
        const targetOpacity = parseFloat(el.dataset.opacity) || 0.18

        if (prefersReducedMotion) {
          gsap.set(el, { opacity: targetOpacity })
          return
        }

        gsap.fromTo(el,
          { opacity: 0, scale: 0.7 },
          {
            opacity: targetOpacity,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: trigger || containerRef.current,
              start: 'top 85%',
            },
            delay: delay,
          }
        )

        gsap.to(el, {
          y: -yDist,
          x: xDist,
          rotate: `+=${rotAmt}`,
          duration: speed,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: delay,
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [trigger])

  return (
    <div ref={containerRef} className="floating-shapes" aria-hidden="true">
      {shapes.map((s, i) => (
        <div
          key={i}
          className={`fs fs--${s.type} fs--${s.color}`}
          data-speed={s.speed}
          data-delay={s.delay}
          data-ydist={s.yDist}
          data-xdist={s.xDist}
          data-rotamt={s.rotAmt}
          data-opacity={s.opacity ?? 0.18}
          style={{
            width:   s.size,
            height:  s.type === 'wave' ? `calc(${s.size} / 5)` : s.size,
            top:     s.top,
            left:    s.left,
            right:   s.right,
            bottom:  s.bottom,
          }}
        />
      ))}
    </div>
  )
}
