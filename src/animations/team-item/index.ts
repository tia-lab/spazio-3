import { ANIM_VAR } from '$/spot.config'
import { gsap } from '@gsap'

const anim_teamItem = (_ctx: any) => {
  const els = document.querySelectorAll('[data-team-item]')
  if (els.length === 0) return

  els.forEach((el) => {
    const title = el.querySelector('h3')
    const text = el.querySelector('.team_bio')
    const link = el.querySelector('.link_underline')
    const line = el.querySelector('.top_line')

    gsap.set(line, { width: 0 })
    gsap.set(text, { autoAlpha: 0, y: '2rem' })
    gsap.set(link, { autoAlpha: 0, y: '2rem' })
    gsap.set(title, { autoAlpha: 0, y: '2rem' })

    const defaults: GSAPTweenVars = {
      duration: ANIM_VAR.duration.default,
      ease: ANIM_VAR.ease.out
    }

    const tl = gsap.timeline({
      defaults: defaults,
      scrollTrigger: {
        trigger: el,
        start: 'top 90%'
      }
    })
    tl.to(line, { width: '100%', duration: ANIM_VAR.duration.goldenRatio }).to(
      [title, text, link],
      {
        autoAlpha: 1,
        y: '0',
        stagger: ANIM_VAR.duration.default / ANIM_VAR.duration.goldenRatio
      },
      '<+=0.25'
    )
  })
}

export default anim_teamItem
