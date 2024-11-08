import { ANIM_VAR } from '$/spot.config'
import { gsap } from '@gsap'
import Lenis from '@studio-freight/lenis'

// Initialize Lenis
const lenis = new Lenis({
  ...ANIM_VAR.lenis.options
})

// Only Lenis raf update, no ScrollTrigger sync
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

export default lenis
