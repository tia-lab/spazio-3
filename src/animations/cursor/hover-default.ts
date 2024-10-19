import { ANIM_VAR } from '$/spot.config'
import { gsap } from '@gsap'

const anim_cursor_hover_default = (ref: any) => {
  const tl = gsap.timeline({ paused: true })

  tl.to(ref, {
    scale: 2,
    pointerEvents: 'none',
    duration: ANIM_VAR.duration.default,
    ease: ANIM_VAR.ease.out
  })

  return tl
}

export default anim_cursor_hover_default
