import { MEDIA } from '$/spot.config'
import { useGsapMatchMedia } from '@/hooks'
import { delay } from '@/utils'
import anim_buttons from './buttons'
import anim_cursor_hover_default from './cursor/hover-default'
import anim_header from './header'
import anim_linkText from './link-text'
import anim_sectionFooter from './sections/footer'
import anim_sectionHero, { animation_hero_enter } from './sections/hero'
import anim_sectionIntro from './sections/intro'
import anim_sectionPortfolio from './sections/portfolio'
import anim_sectionSlider from './sections/slider'
import anim_sectionValues from './sections/values'
import opacityTransition from './transitions/opacity-transition'

const animations = () => {
  useGsapMatchMedia({
    media: MEDIA,
    callback: async (c) => {
      const isPreload = sessionStorage.getItem('preload')
      if (isPreload) {
        animation_hero_enter()
      } else {
        await delay(4000)
        animation_hero_enter()
      }
      anim_header(c)
      anim_sectionHero(c)
      anim_sectionIntro(c)
      anim_sectionSlider(c)
      anim_sectionValues(c)
      anim_sectionPortfolio(c)
      anim_sectionFooter(c)
      await delay(500)
      anim_linkText(c)
      anim_buttons(c)
    },
    scope: document.body
  })
}

export { anim_cursor_hover_default, animations, opacityTransition }
