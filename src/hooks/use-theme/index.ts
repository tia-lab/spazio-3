import { THEME, USE } from '$/spot.config'
import { Theme } from '@/types'
import { ScrollTrigger, gsap } from '@gsap'

const useTheme = () => {
  if (USE.theme === false) return
  const themeSwitch = document.querySelector('[data-theme-switch]')
  const iconDark = document.querySelector('[data-theme-icon="dark"]')
  const iconLight = document.querySelector('[data-theme-icon="light"]')
  if (!themeSwitch) return

  gsap.registerPlugin(ScrollTrigger)

  const theme: Theme = (localStorage.getItem('theme') as Theme) || THEME.default
  document.documentElement.setAttribute('data-theme', theme)

  const hideIcon = (icon: any) => {
    return gsap.set(icon, { display: 'none', autoAlpha: 0 })
  }
  hideIcon(theme === 'dark' ? iconLight : iconDark)

  gsap.set(':root', {
    '--neutral-100': THEME[theme].neutral100,
    '--neutral-200': THEME[theme].neutral200,
    '--neutral-300': THEME[theme].neutral300,
    '--neutral-400': THEME[theme].neutral400
  })

  const switchTheme = () => {
    const currentTheme = document.documentElement.getAttribute(
      'data-theme'
    ) as Theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

    gsap.to(iconDark, {
      display: 'block',
      autoAlpha: newTheme === 'dark' ? 1 : 0
    })
    gsap.to(iconLight, {
      display: 'block',
      autoAlpha: newTheme === 'light' ? 1 : 0
    })

    gsap.to(':root', {
      '--neutral-100': THEME[newTheme].neutral100,
      '--neutral-200': THEME[newTheme].neutral200,
      '--neutral-300': THEME[newTheme].neutral300,
      '--neutral-400': THEME[newTheme].neutral400
    })

    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  ScrollTrigger.observe({ target: themeSwitch, onClick: switchTheme })
}

export default useTheme
