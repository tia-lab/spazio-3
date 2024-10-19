import { MEDIA } from '$/spot.config'
import { useGsapMatchMedia } from '@/hooks'
import anim_cursor_hover_default from './cursor/hover-default'
import anim_section_color from './section-colors'
import anim_sectionPixels from './sections/pixels'
import anim_sectionValues from './sections/values'
import anim_teamItem from './team-item'
import anim_test from './test'
import anim_title from './title'
import opacityTransition from './transitions/opacity-transition'

const animations = () => {
  useGsapMatchMedia({
    media: MEDIA,
    callback: (c) => {
      anim_title(c)
      anim_section_color(c)
      anim_test(c)
      anim_teamItem(c)
      anim_sectionValues(c)
      anim_sectionPixels(c)
    },
    scope: document.body
  })
}

export { anim_cursor_hover_default, animations, opacityTransition }
