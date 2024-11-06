import '@/styles/globals.scss'
import { animations } from './animations'
import { sliders } from './components'
import { useCursor, useScrollbar, useTheme } from './hooks'
import lenis from './hooks/use-lenis'
const router = async () => {
  const { preload } = await import('./components/Preload/preload')
  preload()
  lenis
  lenis.scrollTo(0, { immediate: true })
  //Theme
  useTheme()

  //cursor
  const cursor = useCursor()
  cursor?.cursorMove()
  cursor?.cursorHover()

  cursor?.cursorHover()
  animations()
  sliders()

  //Scrollbar
  useScrollbar()
}

router()
