import { ANIM_VAR } from '$/spot.config'
import { drawPixels, generatePixelGrid } from '@/animations/pixels'
import { useKeyPress } from '@/hooks'
import lenis from '@/hooks/use-lenis'
import { ScrollTrigger, gsap } from '@gsap'
import Swiper from 'swiper'

const name = "[data-section='slider']"
const pixels = "[data-pixels='slider']"
const modal = document.querySelector('[data-modal="slider"]') as HTMLElement
const modalText = modal.querySelector('[data-modal-content]') as HTMLElement
const modalTitle = modal.querySelector('[data-modal-title]') as HTMLElement
const modalClose = modal.querySelector('[data-modal-close]') as HTMLElement
const defaults: GSAPTweenVars = {
  ease: ANIM_VAR.ease.out
}

const anim_sectionSlider = (_ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)

  sections.forEach((section) => {
    gsap.context(() => {
      anim_pixels(section)
      anim_slider(section)
      anim_modal(section, _ctx)
    }, section)
  })
}

const anim_slider = (section: HTMLElement) => {
  const swiper = new Swiper('.swiper-container', {
    slidesPerView: 1,
    spaceBetween: 0
  })
  console.log('section', swiper)
}

const anim_pixels = (section: HTMLElement) => {
  const pixelContainers = Array.from(
    document.querySelectorAll<HTMLDivElement>(pixels) // Adjust selector if necessary
  )

  pixelContainers.forEach((container) => {
    console.log('container', container)
    // Generate pixels grid for each container
    const { pixels, shuffledPixels, canvas, context } = generatePixelGrid({
      container,
      cols: 25,
      colorStart: '0,0,0', // Starting color (e.g., black)
      colorEnd: '255,255,255' // Ending color (e.g., white)
    })

    if (!canvas || !context || pixels.length === 0) {
      console.error('Pixel grid generation failed')
      return
    }

    drawPixels({ pixels, context, canvas })
    const animatingPixels = shuffledPixels.filter((pixel) => !pixel.isStatic)

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'bottom bottom',
        end: 'bottom top',
        markers: true,
        scrub: true,
        fastScrollEnd: true
      }
    })

    tl.to(container, { bottom: '-10vh', ease: 'none', duration: 4 }).to(
      animatingPixels,
      {
        stagger: { amount: 2, from: 'random' },
        colorString: 'rgb(255, 255, 255)', // Animate to white
        duration: ANIM_VAR.duration.default / 2,
        onUpdate: () => drawPixels({ pixels, context, canvas }), // Redraw on each update
        ease: ANIM_VAR.ease.out
      },
      '<'
    )
  })
}

const anim_modal = (section: HTMLElement, _ctx: any) => {
  gsap.set(modal, { autoAlpha: 0, display: 'none' })

  const paths = gsap.utils.toArray('path', modalClose) as HTMLElement[]

  const tlButton = gsap.timeline({
    paused: true,
    defaults: { ...defaults, duration: ANIM_VAR.duration.default / 2 }
  })
  tlButton
    .to([paths[0], paths[1]], { yPercent: 100 })
    .to([paths[2], paths[3]], { yPercent: -100 }, '<')
    .to([paths[0], paths[2]], { xPercent: 100 })
    .to([paths[1], paths[3]], { xPercent: -100 }, '<')

  let isOpen = false
  const tl = gsap.timeline({ defaults, paused: true })
  tl.to(modal, { display: 'block', duration: 0 }).to(modal, { autoAlpha: 1 })
  const sliders = gsap.utils.toArray('.slider_slide', section) as HTMLElement[]
  sliders.forEach((slide) => {
    gsap.context(() => {
      const button = '.slider_slide_button'
      const title = slide.querySelector(
        '.slider_slide_title>.title-display'
      ) as HTMLElement
      const text = slide.querySelector('.slider_slide_text') as HTMLElement
      ScrollTrigger.observe({
        target: button,
        onClick: () => {
          if (isOpen) return
          modalTitle.innerHTML = title.innerHTML
          modalText.innerHTML = text.innerHTML
          tl.play()
          lenis?.stop()
          isOpen = true
        }
      })
    }, slide)
  })

  ScrollTrigger.observe({
    target: modalClose,
    onHover: () => {
      tlButton.play()
    },
    onHoverEnd: () => {
      tlButton.reverse()
    },
    onClick: () => {
      if (!isOpen) return
      tl.reverse().eventCallback('onReverseComplete', () => {
        isOpen = false
        lenis?.start()
      })
    }
  })

  useKeyPress({
    key: 'Escape',
    callback: () =>
      tl.reverse().eventCallback('onReverseComplete', () => {
        isOpen = false
        lenis?.start()
      })
  })
}

export default anim_sectionSlider
