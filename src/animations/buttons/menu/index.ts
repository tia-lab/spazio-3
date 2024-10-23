import { ANIM_VAR } from '$/spot.config'
import { collectionItemsCount } from '@/utils'
import { ScrollTrigger, gsap } from '@gsap'

const name = '[data-anim="menu-button"]'

const defaults: GSAPTweenVars = {
  duration: ANIM_VAR.duration.default,
  ease: ANIM_VAR.ease.out
}

const anim_menuButton = async (_ctx: any) => {
  const els = gsap.utils.toArray(name) as HTMLElement[]
  if (els.length === 0) return
  gsap.registerPlugin(ScrollTrigger)

  els.forEach((button) => {
    gsap.context(() => {
      //Anchor is in the header
      const icon = '.menu_button_icon'
      const paths = gsap.utils.toArray('path', button) as SVGPathElement[]
      const text = '.text-menu-btn'
      const counter = button.querySelector('[data-count]') as HTMLElement
      gsap.set(paths, { rotate: 45, transformOrigin: 'center' })
      gsap.set(paths[1], { yPercent: 70, xPercent: 70 })
      gsap.set(paths[2], { yPercent: 70, xPercent: -70 })
      gsap.set([icon, text, counter], { left: '-7.5rem' })

      const tl = gsap.timeline({ paused: true, defaults })
      tl.to([icon, text, counter], { left: 0 })
        .to(paths, { rotate: 0 }, 0.1)
        .to(paths[1], { yPercent: 0, xPercent: 0 }, '<')
        .to(paths[2], { yPercent: 0, xPercent: 0 }, '<')

      ScrollTrigger.observe({
        target: button,
        onHover: () => tl.play(),
        onHoverEnd: () => tl.reverse()
      })

      //Counters
      setTimeout(() => {
        if (counter && counter.dataset.count) {
          console.log('count')
          const items = collectionItemsCount({
            attribute: `[data-count-items="${counter.dataset.count}"]`,
            toString: true
          }) as string

          if (items) {
            const target = counter.querySelector(
              '.text-menu-counter'
            ) as HTMLElement
            target && (target.innerHTML = items)
          }
        }
      }, 200)
    }, button)
  })
}

export default anim_menuButton
