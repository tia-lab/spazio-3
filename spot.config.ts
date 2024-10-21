import { colorsVars } from '@/styles/config/colors'
import { Theme } from '@/types'
import { LenisOptions } from '@studio-freight/lenis'
const goldenRatio = (1 + Math.sqrt(5)) / 2
const localhost =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_LOCALHOST_URL
    : ''
const host =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_PROD_URL
    : ''

export const COLORS = colorsVars

const SPOT_CONFIG = {
  admin: {
    dev: true,
    localhost: localhost || '',
    host: host || ''
  },

  routes: {
    home: 'home',
    about: 'about',
    contact: 'contact',
    projects: 'projects',
    project: 'projects/template'
  },

  theme: {
    default: 'light' as Theme,
    light: colorsVars,
    dark: colorsVars
  },
  media: {
    desktop: '(min-width: 1024px)',
    tillTablet: '(min-width: 641px)',
    tablet: '(max-width: 1023px)',
    mobile: '(max-width: 640px)',
    landscape: '(min-aspect-ratio: 16/9)',
    portrait: '(max-aspect-ratio: 9/16)',
    square: '(min-aspect-ratio: 1/1) and (max-aspect-ratio: 4/3)'
  },
  breakpoints: {
    mobile: 767,
    tablet: 991
  },
  animations: {
    vars: {
      lenis: {
        options: { lerp: 0.025 } as LenisOptions,
        gsapSync: true
      },
      ease: {
        out: 'power2.out',
        in: 'power2.in',
        inOut: 'power2.inOut',
        none: 'none',
        expoIn: 'expo.in',
        expoOut: 'expo.out',
        expoInOut: 'expo.inOut',
        circIn: 'circ.in',
        circOut: 'circ.out',
        circInOut: 'circ.inOut',
        rough:
          'rough({ template: none.out, strength: 1, points: 20, taper: none, randomize: true, clamp: false})'
      },
      duration: {
        default: 1 / goldenRatio,
        goldenRatio: goldenRatio,
        stagger: 1 / goldenRatio / 5
      }
    }
  },
  use: {
    lenis: true,
    cursor: true,
    theme: false,
    scrollbar: false,
    transition: true,
    preload: true,
    i18n: true,
    pageLines: true
  },
  debug: {
    barba: false,
    lenis: false
  }
}

const ANIM_VAR = SPOT_CONFIG.animations.vars
const ADMIN = SPOT_CONFIG.admin
const ROUTES = SPOT_CONFIG.routes
const DEBUG = SPOT_CONFIG.debug
const USE = SPOT_CONFIG.use
const MEDIA = SPOT_CONFIG.media
const THEME = SPOT_CONFIG.theme

export { ADMIN, ANIM_VAR, DEBUG, MEDIA, ROUTES, SPOT_CONFIG, THEME, USE }
