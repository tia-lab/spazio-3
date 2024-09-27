import { DEBUG, ROUTES, USE } from '$/spot.config'
import '@/styles/globals.scss'
import barba from '@barba/core'
import { animations, opacityTransition } from './animations'
import { sliders } from './components'
import { useCursor, useLenis, useScrollbar, useTheme } from './hooks'
const router = () => {
  //Theme
  useTheme()

  //lenis
  useLenis()

  //cursor
  const cursor = useCursor()
  cursor?.cursorMove()
  cursor?.cursorHover()

  //sliders

  //Scrollbar
  useScrollbar()

  barba.hooks.beforeOnce(() => {})
  barba.hooks.once(() => {})
  barba.hooks.afterOnce(() => {})
  barba.hooks.before(() => {})
  barba.hooks.beforeLeave(() => {})
  barba.hooks.leave(() => {})
  barba.hooks.afterLeave(() => {})
  barba.hooks.beforeEnter(async () => {
    const { preload } = await import('./components/Preload/preload')
    preload()
  })
  barba.hooks.enter(() => {})
  barba.hooks.afterEnter(() => {
    if (USE.lenis) {
      const lenis = useLenis()?.lenis
      lenis?.scrollTo(0, { immediate: true })
    }
    cursor?.cursorHover()
    animations()
    sliders()
  })
  barba.hooks.after(() => {})

  barba.init({
    debug: DEBUG.barba,
    preventRunning: true,

    //cacheIgnore: ['/contact/', '/:category/post?'],
    views: [
      {
        namespace: ROUTES.home,
        async beforeEnter() {
          const { page } = await import('./pages/home/home')
          page()
        },
      },
      {
        namespace: ROUTES.about,

        async beforeEnter() {
          const { page } = await import('./pages/about/about')
          page()
        },
      },
    ],
    transitions: [opacityTransition],
  })
}

router()
