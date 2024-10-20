import { ANIM_VAR, COLORS, MEDIA, USE } from '$/spot.config'
import { useGsapMatchMedia } from '@/hooks'
import { DrawSVGPlugin, Flip, gsap } from '@gsap'
import './preload.scss'

export const preload = () => {
  if (USE.preload === false) return
  const preload = document.querySelector('[data-preload]')
  if (!preload) return

  //check session storage
  const session = sessionStorage.getItem('preload')
  if (session === 'true') {
    preload.remove()
    return
  }

  //watch session

  useGsapMatchMedia({
    media: MEDIA,
    callback: (_c) => {
      gsap.registerPlugin(DrawSVGPlugin, Flip)
      const wrap = document.querySelector('.preload_wrap')
      const blocks = '.preload_block'
      const blocksSvg = '.preload_block svg rect'
      const blocksBg = '.preload_block_bg'
      gsap.set(wrap, { autoAlpha: 0 })
      gsap.set(blocksSvg, { drawSVG: '0%' })
      const defaults: GSAPTweenVars = {
        duration: ANIM_VAR.duration.default,
        ease: ANIM_VAR.ease.out
      }

      const tl = gsap.timeline({
        defaults,
        onComplete: () => {
          //sessionStorage.setItem('preload', 'true')
        }
      })

      tl.to(wrap, { autoAlpha: 1 })
        .to(
          blocksSvg,
          {
            drawSVG: '100%',
            duration: ANIM_VAR.duration.goldenRatio,
            stagger: {
              amount: ANIM_VAR.duration.default / ANIM_VAR.duration.goldenRatio,
              from: 'random'
            },
            ease: 'none'
          },
          '<+=0.25'
        )
        .to(blocksBg, {
          yPercent: -100,
          stagger: {
            amount: ANIM_VAR.duration.default / ANIM_VAR.duration.goldenRatio,
            from: 'random'
          },
          onComplete: () => {
            gsap.set(blocks, { background: COLORS.neutral100 })
          }
        })
        .to(blocks, { width: '1.5rem', height: '1.5rem' })
        .add(() => {
          // Capture initial state of the wrap
          const state = Flip.getState(wrap)

          // Move the wrap to the top center of the screen
          gsap.set(wrap, {
            position: 'absolute',
            top: '1rem',
            left: '50%',
            xPercent: -50,
            yPercent: 0
          })

          // Animate the wrap to the new position using Flip
          Flip.from(state, {
            duration: ANIM_VAR.duration.default,
            ease: ANIM_VAR.ease.out,
            onComplete: () => {
              const tlExit = gsap.timeline({ defaults: { defaults } })

              tlExit
                .to(preload, {
                  autoAlpha: 0,
                  ...defaults
                })
                .to(preload, {
                  display: 'none',
                  onComplete: () => {
                    preload.remove()
                    sessionStorage.setItem('preload', 'true')
                  }
                })
            }
          })
        })
    },
    scope: preload
  })
}
