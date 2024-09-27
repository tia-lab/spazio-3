import { disable_arrows } from '@/utils'
import Splide from '@splidejs/splide'

const slide_default = () => {
  const name = 'default'
  const elms = document.querySelectorAll(`[data-slider="${name}"]`)
  if (elms.length === 0) return

  for (let i = 0; i < elms.length; i++) {
    const splide = new Splide(elms[i] as any, {
      autoWidth: true,
      padding: { left: '1.25rem', right: '1.25rem' },
      gap: '1rem',
      arrows: true,
      pagination: false,
      mediaQuery: 'min',
      /* classes: {
        prev: 'splide__arrow--prev is-splide-3cols',
        next: 'splide__arrow--next is-splide-3cols',
      }, */

      breakpoints: {
        768: {
          autoWidth: false,
          perPage: 3,
          padding: { left: '0rem', right: '1rem' },
          arrows: false,
          gap: '1.875rem',
        },
      },
    })
    splide.on('ready', function () {
      splide?.Components?.Arrows?.arrows?.prev?.classList.add('disabled')
    })

    splide.on('move', () => {
      disable_arrows(
        splide.Components.Controller.getEnd(),
        splide.index,
        splide.Components.Arrows.arrows.prev,
        splide.Components.Arrows.arrows.next,
        'disabled'
      )
    })

    splide.mount()
  }
}

export default slide_default
