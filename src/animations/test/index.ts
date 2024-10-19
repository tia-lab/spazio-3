import { ANIM_VAR } from '$/spot.config'
import { gsap } from '@gsap'

const anim_test = (_ctx: any) => {
  const els = document.querySelectorAll('[data-anim="test"]')
  if (els.length === 0) return

  els.forEach((el) => {
    const defaults: GSAPTweenVars = {
      duration: ANIM_VAR.duration.default,
      ease: ANIM_VAR.ease.out,
    }
    gsap.set(el, { autoAlpha: 0, y: '2rem' })
    const tl = gsap.timeline({
      defaults: defaults,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
      },
    })
    tl.to(el, { autoAlpha: 1, y: '0', backgroundColor: 'red' })
  })
}

export default anim_test