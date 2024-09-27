import { ANIM_VAR, DEBUG, USE } from '$/spot.config'
import { ScrollTrigger, gsap } from '@gsap'
import Lenis from '@studio-freight/lenis'

const useLenis = () => {
  if (USE.lenis === false) return
  const lenis = new Lenis(ANIM_VAR.lenis.options)

  function raf(time: number) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }

  if (ANIM_VAR.lenis.gsapSync) {
    gsap.registerPlugin(ScrollTrigger)
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
    if (DEBUG.lenis) console.log('useLenis: gsapSync')
  } else {
    requestAnimationFrame(raf)
  }

  if (DEBUG.lenis) {
    lenis.on('scroll', () => {
      console.log('progress', lenis.progress)
      console.log('scroll', lenis.scroll)
    })
  }

  return { lenis }
}

export default useLenis
