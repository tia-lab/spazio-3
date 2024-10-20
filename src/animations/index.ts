import { MEDIA } from '$/spot.config'
import { useGsapMatchMedia } from '@/hooks'
import { delay } from '@/utils'
import anim_cursor_hover_default from './cursor/hover-default'
import anim_section_color from './section-colors'
import anim_sectionFooter from './sections/footer'
import anim_sectionIntro from './sections/intro'
import anim_sectionPixels from './sections/pixels'
import anim_sectionPortfolio from './sections/portfolio'
import anim_sectionTeam from './sections/team'
import anim_sectionValues from './sections/values'
import anim_test from './test'
import anim_title from './title'
import opacityTransition from './transitions/opacity-transition'

const animations = () => {
  useGsapMatchMedia({
    media: MEDIA,
    callback: async (c) => {
      anim_title(c)
      anim_test(c)
      anim_sectionIntro(c)
      anim_sectionValues(c)
      anim_sectionPixels(c)
      anim_sectionPortfolio(c)
      anim_sectionTeam(c)
      anim_sectionFooter(c)
      await delay(500)
      anim_section_color(c)
    },
    scope: document.body
  })
}

export { anim_cursor_hover_default, animations, opacityTransition }
