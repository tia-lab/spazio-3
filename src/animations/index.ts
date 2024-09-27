import { MEDIA } from '$/spot.config'
import { useGsapMatchMedia } from '@/hooks'
import anim_cursor_hover_default from './cursor/hover-default'
import anim_test from './test'
import anim_title from './title'
import opacityTransition from './transitions/opacity-transition'

const animations = () => {
  useGsapMatchMedia({
    media: MEDIA,
    callback: (c) => {
      anim_title(c)
      anim_test(c)
    },
    scope: document.body,
  })
}

export { anim_cursor_hover_default, animations, opacityTransition }
