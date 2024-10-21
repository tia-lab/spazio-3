import { ANIM_VAR } from '$/spot.config'
import { DrawSVGPlugin, ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='values']"

const anim_sectionValues = (ctx: any) => {
  ctx.conditions.tillTablet && anim_sectionValues_tillTablet(ctx)
}

const anim_sectionValues_tillTablet = (_ctx: any) => {
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
        end: '+=4250',
        scrub: true,
        pin: true,
        fastScrollEnd: true,
        onEnter: () => {
          ScrollTrigger.refresh()
        },
        onLeave: () => {
          ScrollTrigger.refresh()
        }
      }
    })

    cards.forEach((card, i) => {
      const icon = card.querySelector('.card_values_icon')
      const iconPath = card.querySelectorAll('.card_values_icon_svg path')
      const text = card.querySelector('.card_values_text')
      const border = card.querySelector('.card_values_border svg rect')
      gsap.set(card, { y: `${i * 10.5}rem`, autoAlpha: 0 })

      gsap.set(text, { yPercent: 150 })
      gsap.set([border, iconPath], { drawSVG: '0%' })

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
        .to(iconPath, {
          drawSVG: '100%',
          stagger: { amount: ANIM_VAR.duration.default, from: 'random' }
        })
        .to(text, {
          autoAlpha: 1,
          yPercent: 0,
          stagger: ANIM_VAR.duration.default / ANIM_VAR.duration.goldenRatio
        })
        .to(
          iconPath,
          {
            fillOpacity: 1,
            stagger: { amount: ANIM_VAR.duration.default, from: 'random' }
          },
          '<'
        )

      // Add each card's timeline to the master timeline with a slight stagger
      masterTimeline.add(cardTimeline, i * 0.3)
    })
  })
}

export default anim_sectionValues
