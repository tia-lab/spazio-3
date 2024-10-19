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

export const COLORS = {
  neutral100: '#FFF',
  neutral200: '#777C87',
  neutral300: '#3A3F49',
  neutral400: '#08090A',
  red: '#E8210F'
}

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
    light: {
      neutral100: COLORS.neutral100,
      neutral200: COLORS.neutral200,
      neutral300: COLORS.neutral300,
      neutral400: COLORS.neutral400,
      red: COLORS.red
    },
    dark: {
      neutral100: COLORS.neutral400,
      neutral200: COLORS.neutral200,
      neutral300: COLORS.neutral300,
      neutral400: COLORS.neutral100,
      red: COLORS.red
    }
  },
  media: {
    desktop: '(min-width: 1024px)',
    tablet: '(max-width: 1023px)',
    mobile: '(max-width: 640px)'
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
    scrollbar: true,
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
