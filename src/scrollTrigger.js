import gsap from 'gsap'

let promise

export function loadScrollTrigger() {
  if (!promise) {
    promise = import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger)
      return ScrollTrigger
    })
  }
  return promise
}
