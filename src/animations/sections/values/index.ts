import { ANIM_VAR } from '$/spot.config'
import { DrawSVGPlugin, ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='values']"

const anim_sectionValues = (_ctx: any) => {
  const els = gsap.utils.toArray(name) as HTMLElement[]
  if (els.length === 0) return

  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger)

  els.forEach((el) => {
    const cards = gsap.utils.toArray('.card_values') as HTMLElement[]
    if (cards.length === 0) return

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'center center',
        end: '+=3500',
        scrub: true,
        pin: true
      }
    })

    cards.forEach((card, i) => {
      const icon = card.querySelector('.card_values_icon')
      const text = card.querySelector('.card_values_text')
      const border = card.querySelector('.card_values_border svg rect')
      gsap.set(card, { y: `${i * 10.5}rem`, autoAlpha: 0 })
      gsap.set(icon, { autoAlpha: 0, y: '-2rem' })
      gsap.set(text, { autoAlpha: 0, y: '2rem' })
      gsap.set(border, { drawSVG: '0%' })

      // Create a custom timeline for each card
      const cardTimeline = gsap.timeline({
        defaults: {
          duration: ANIM_VAR.duration.default,
          ease: ANIM_VAR.ease.out
        }
      })

      // Define custom animations for each card in its timeline
      cardTimeline
        .to(card, {
          y: 0,
          autoAlpha: 1
        })
        .to(
          border,
          {
            drawSVG: '100%',
            ease: 'none',
            duration: ANIM_VAR.duration.default * 2
          },
          0
        )
        .to([icon, text], {
          autoAlpha: 1,
          y: 0,
          stagger: ANIM_VAR.duration.default / ANIM_VAR.duration.goldenRatio
        })

      // Add each card's timeline to the master timeline with a slight stagger
      masterTimeline.add(cardTimeline, i * 0.3)
    })
  })
}

export default anim_sectionValues
