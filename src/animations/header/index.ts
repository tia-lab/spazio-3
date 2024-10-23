import { ANIM_VAR } from '$/spot.config'
import { useKeyPress } from '@/hooks'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='header']"
const nav = '[data-nav]'
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
      const nav = '[data-nav]'
      const openButton = section.querySelector("[data-button='open-nav']")
      gsap.set([nav, hiddenNavBlocks], { display: 'none', autoAlpha: 0 })

      const animNav = anim_nav(section)

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
            openButton?.classList.add('is-open')
            animNav?.play().eventCallback('onComplete', () => {
              section.setAttribute('data-open', 'true')
            })
          }
          if (section.dataset.open === 'true') {
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
    }, section)
  })
}

const anim_nav = (section: HTMLElement): GSAPTimeline | undefined => {
  const tlNavOpen = gsap.timeline({ paused: true, defaults })
  tlNavOpen
    .to(nav, { display: 'block', duration: 0 })
    .to(nav, { autoAlpha: 1 })
    .to(hiddenNavBlocks, { display: 'block', duration: 0 }, '<')
    .to(hiddenNavBlocks, { autoAlpha: 1 }, '>')

  return tlNavOpen
}

export default anim_header
