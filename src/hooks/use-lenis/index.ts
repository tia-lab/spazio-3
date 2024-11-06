import { ANIM_VAR } from '$/spot.config'
import { ScrollTrigger, gsap } from '@gsap'
import Lenis from '@studio-freight/lenis'

// Initialize Lenis once and export the instance
const lenis = new Lenis({
  ...ANIM_VAR.lenis.options
})

// GSAP sync if desired
gsap.registerPlugin(ScrollTrigger)
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

export default lenis
