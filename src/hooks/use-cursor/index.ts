import { ANIM_VAR, MEDIA, USE } from '$/spot.config'
import { ScrollTrigger, gsap } from '@gsap'
import useGsapMatchMedia from '../use-gsap/use-gsap-match-media'

const useCursor = () => {
  if (USE.cursor === false) return
  const cursor = document.querySelector('[data-cursor]')
  if (!cursor) return

  const cursorMove = () => {
    useGsapMatchMedia({
      scope: document.body,
      media: MEDIA.desktop,
      callback(c) {
        if (!c) return
        gsap.registerPlugin(ScrollTrigger)

        const defaults: GSAPTweenVars = {
          duration: ANIM_VAR.duration.default,
          ease: ANIM_VAR.ease.out
        }
        const xTo = gsap.quickTo(cursor, 'x', defaults)
        const yTo = gsap.quickTo(cursor, 'y', defaults)

        ScrollTrigger.observe({
          onMove: ({ x, y }) => {
            xTo(x as number)
            yTo(y as number)
          }
        })
      }
    })
  }

  const cursorHover = () => {
    useGsapMatchMedia({
      scope: document.body,
      media: MEDIA.desktop,
      callback(c) {
        if (!c) return
        const linksDefault = gsap.utils.toArray('[data-anim-cursor]')
        const linksSlider = gsap.utils.toArray('[data-anim-cursor-slider]')
        if (!linksDefault.length) return
        linksDefault.forEach((link: any) => {
          ScrollTrigger.observe({
            target: link,
            onHover: () => {
              cursor.classList.add('is-active')
            },
            onHoverEnd: () => {
              cursor.classList.remove('is-active')
            }
          })
        })
        linksSlider.forEach((link: any) => {
          ScrollTrigger.observe({
            target: link,
            onHover: () => {
              cursor.classList.add('is-slider')
            },
            onHoverEnd: () => {
              cursor.classList.remove('is-slider')
            }
          })
        })
      }
    })
  }
  return { cursorMove, cursorHover }
}

export default useCursor
