import { MEDIA } from '$/spot.config'
import { useGsapMatchMedia } from '@/hooks'
import anim_cursor_hover_default from './cursor/hover-default'
import anim_sectionHero from './sections/hero.ts'
import opacityTransition from './transitions/opacity-transition'

const animations = () => {
  useGsapMatchMedia({
    media: MEDIA,
    callback: async (c) => {
      anim_sectionHero(c)
      /*  anim_title(c)
      anim_test(c)
      anim_sectionIntro(c)
      anim_sectionValues(c)
      anim_sectionPortfolio(c)
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
