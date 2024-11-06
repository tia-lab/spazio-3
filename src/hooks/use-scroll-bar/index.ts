import { ANIM_VAR, MEDIA, USE } from '$/spot.config'
import { ScrollTrigger, gsap } from '@gsap'
import useGsapMatchMedia from '../use-gsap/use-gsap-match-media'

const useScrollbar = () => {
  if (USE.scrollbar === false) return
  const scrollbar = document.querySelector('[data-scrollbar]')
  if (!scrollbar) return

  useGsapMatchMedia({
    scope: document.body,
    media: MEDIA.desktop,
    callback(c) {
      if (!c) return
      gsap.registerPlugin(ScrollTrigger)
      //const lenis = useLenis()?.lenis
      const scroller = scrollbar.querySelector('[data-scrollbar-scroller]')
      const defaults: GSAPTweenVars = {
        duration: ANIM_VAR.duration.default,
        ease: ANIM_VAR.ease.out
      }
      /* if (lenis) {
        lenis.on('scroll', () => {
          gsap.to(scroller, {
            left: `${lenis.progress * 100}%`,
            ...defaults
          })
        })
      } */
    }
  })
}

export default useScrollbar
