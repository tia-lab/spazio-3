import { MEDIA } from '$/spot.config'
import { useGsapMatchMedia } from '@/hooks'
import { delay } from '@/utils'
import anim_cursor_hover_default from './cursor/hover-default'
import anim_linkText from './link-text'
import anim_sectionFooter from './sections/footer'
import anim_sectionHero from './sections/hero'
import anim_sectionIntro from './sections/intro'
import anim_sectionPortfolio from './sections/portfolio'
import anim_sectionSlider from './sections/slider'
import anim_sectionValues from './sections/values'
import opacityTransition from './transitions/opacity-transition'

const animations = () => {
  useGsapMatchMedia({
    media: MEDIA,
    callback: async (c) => {
      anim_sectionHero(c)
      anim_sectionIntro(c)
      anim_sectionSlider(c)
      anim_sectionValues(c)
      anim_sectionPortfolio(c)
      anim_sectionFooter(c)
      await delay(500)
      anim_linkText(c)
      /*  anim_title(c)
      anim_test(c)
      anim_sectionIntro(c)
      
      
      anim_sectionTeam(c)
      anim_sectionFooter(c)
      anim_sectionPixels(c)
      initializePixelAnimation()
      await delay(500)
      anim_section_color(c)
      anim_linkText(c) */
    },
    scope: document.body
  })
}

export { anim_cursor_hover_default, animations, opacityTransition }
