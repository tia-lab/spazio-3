import { ANIM_VAR } from '$/spot.config'
import { useKeyPress } from '@/hooks'
import lenis from '@/hooks/use-lenis'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='header']"
const nav = document.querySelector('[data-nav]') as HTMLElement
const hiddenNavBlocks = '.logo_block.is-open'

const defaults: GSAPTweenVars = {
  duration: ANIM_VAR.duration.default,
  ease: ANIM_VAR.ease.out
}

const anim_header = async (_ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)
  sections.forEach((section) => {
    gsap.context(async () => {
      const openButton = section.querySelector("[data-button='open-nav']")
      const menuButtons = gsap.utils.toArray(
        '.menu_button',
        nav
      ) as HTMLElement[]
      const animNav = anim_nav()

      gsap.set([nav, hiddenNavBlocks], { display: 'none', autoAlpha: 0 })

      ScrollTrigger.observe({
        target: openButton,
        onHover: () => {
          openButton?.classList.add('is-hover')
        },
        onHoverEnd: () => {
          openButton?.classList.remove('is-hover')
        },
        onClick: () => {
          if (section.dataset.open === 'false') {
            lenis?.stop()
            openButton?.classList.add('is-open')
            animNav?.play().eventCallback('onComplete', () => {
              section.setAttribute('data-open', 'true')
            })
          }
          if (section.dataset.open === 'true') {
            lenis?.start()
            animNav?.reverse().eventCallback('onReverseComplete', () => {
              section.setAttribute('data-open', 'false')
              openButton?.classList.remove('is-open')
            })
          }
        }
      })

      useKeyPress({
        callback: () => {
          if (section.dataset.open === 'true') {
            animNav?.reverse().eventCallback('onReverseComplete', () => {
              section.setAttribute('data-open', 'false')
              openButton?.classList.remove('is-open')
            })
          }
        }
      })

      menuButtons.forEach((button) => {
        const anchor = button.dataset.anchor
        ScrollTrigger.observe({
          target: button,
          onClick: () => {
            lenis.start()
            if (anchor) {
              lenis?.scrollTo(anchor, { duration: 0.25 })
              if (section.dataset.open === 'true') {
                console.log('close')
                animNav?.reverse().eventCallback('onReverseComplete', () => {
                  section.setAttribute('data-open', 'false')
                  openButton?.classList.remove('is-open')
                  ScrollTrigger.refresh()
                })
              }
            }
          }
        })
      })
    }, section)
  })
}

const anim_nav = (): GSAPTimeline | undefined => {
  const tlNavOpen = gsap.timeline({ paused: true, defaults })
  tlNavOpen
    .to(nav, { display: 'block', duration: 0 })
    .to(nav, { autoAlpha: 1 })
    .to(hiddenNavBlocks, { display: 'block', duration: 0 }, '<')
    .to(hiddenNavBlocks, { autoAlpha: 1 }, '>')

  return tlNavOpen
}

export default anim_header
