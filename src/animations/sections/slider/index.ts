import { ANIM_VAR } from '$/spot.config'
import { drawPixels, generatePixelGrid } from '@/animations/pixels'
import { useKeyPress } from '@/hooks'
import lenis from '@/hooks/use-lenis'
import { ScrollTrigger, gsap } from '@gsap'
import { Application } from '@splinetool/runtime'
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
      anim_pixels(section, _ctx)
      anim_slider(section)
      anim_modal(section, _ctx)
    }, section)
  })
}

const anim_slider = async (section: HTMLElement) => {
  const canvas = section.querySelector(
    '.spline_slider_canvas'
  ) as HTMLCanvasElement
  if (!canvas) return

  const spline = new Application(canvas)
  const toRadians = (degrees: number) => degrees * (Math.PI / 180)

  spline
    .load('https://prod.spline.design/qqDCMoeVS30S5rzI/scene.splinecode')
    .then(() => {
      const obj = spline.findObjectByName('spaziotre') as any
      gsap.set(obj.position, { x: 10, y: 0, z: 0 })
      gsap.set(obj.rotation, {
        x: toRadians(25),
        y: toRadians(45),
        z: toRadians(0)
      })
      gsap.set(obj.scale, { x: 0.9, y: 0.9, z: 0.9 })

      const animDeafults: GSAPTweenVars = {
        duration: ANIM_VAR.duration.default,
        ease: ANIM_VAR.ease.out
      }

      const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: false,
        pagination: false,
        simulateTouch: false,
        breakpoints: {
          992: {
            // Adjust the breakpoint as needed
            direction: 'vertical' // Desktop: vertical
          },
          0: {
            direction: 'horizontal' // Mobile: horizontal
          }
        }
      })

      // Add custom navigation
      const nextButton = section.querySelector(
        '.slide_button_next'
      ) as HTMLElement
      const prevButton = section.querySelector(
        '.slide_button_prev'
      ) as HTMLElement

      if (nextButton && prevButton) {
        const updateButtonState = () => {
          prevButton.classList.toggle('disabled', swiper.isBeginning)
          nextButton.classList.toggle('disabled', swiper.isEnd)
        }

        updateButtonState()

        nextButton.addEventListener('click', () => {
          swiper.slideNext()
          updateButtonState()
        })
        prevButton.addEventListener('click', () => {
          swiper.slidePrev()
          updateButtonState()
        })

        swiper.on('slideChange', updateButtonState)
      }

      // Custom pagination bullets
      const paginationContainer = section.querySelector(
        '.slide_pagination'
      ) as HTMLElement
      if (paginationContainer) {
        paginationContainer.innerHTML = '' // Clear existing bullets

        // Create pagination bullets
        swiper.slides.forEach((_, index) => {
          const bullet = document.createElement('div')
          bullet.classList.add('pagination_bullet')

          // Add click event to bullet
          bullet.addEventListener('click', () => {
            swiper.slideTo(index) // Navigate to the clicked bullet's slide
          })

          paginationContainer.appendChild(bullet)
        })
      }

      // Function to update pagination bullets
      const updatePagination = () => {
        const bullets =
          paginationContainer.querySelectorAll('.pagination_bullet')
        bullets.forEach((bullet, index) => {
          bullet.classList.toggle('active', index === swiper.activeIndex)
        })
      }

      updatePagination() // Initial pagination state
      swiper.on('slideChange', updatePagination) // Update on slide change

      swiper.on('slideChange', () => {
        switch (swiper.activeIndex) {
          case 0:
            gsap.to(obj.position, { x: 10, y: 0, z: 0, ...animDeafults })
            gsap.to(obj.rotation, {
              x: toRadians(25),
              y: toRadians(45),
              z: toRadians(0),
              ...animDeafults
            })
            gsap.to(obj.scale, {
              x: 0.9,
              y: 0.9,
              z: 0.9,
              ...animDeafults
            })
            break
          case 1:
            gsap.to(obj.position, { x: 10, y: 0, z: 0, ...animDeafults })
            gsap.to(obj.rotation, {
              x: toRadians(-40),
              y: toRadians(-30),
              z: toRadians(0),
              ...animDeafults
            })
            gsap.to(obj.scale, {
              x: 1.2,
              y: 1.2,
              z: 1.2,
              ...animDeafults
            })
            break
          case 2:
            gsap.to(obj.position, { x: -9, y: 10, z: 0, ...animDeafults })
            gsap.to(obj.rotation, {
              x: toRadians(-10),
              y: toRadians(-130),
              z: toRadians(0),
              ...animDeafults
            })
            gsap.to(obj.scale, {
              x: 0.9,
              y: 0.9,
              z: 0.9,
              ...animDeafults
            })
            break
        }
      })
    })
}

const anim_pixels = (section: HTMLElement, ctx: any) => {
  const pixelContainers = Array.from(
    document.querySelectorAll<HTMLDivElement>(pixels) // Adjust selector if necessary
  )

  pixelContainers.forEach((container) => {
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
        scrub: true,
        fastScrollEnd: true
      }
    })

    tl.to(container, { bottom: '-10vh', ease: 'none', duration: 4 })
      .to(
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
      .to('.main-wrapper', { y: '-10vh', duration: 4 }, '<')
      .to(
        '.home_slider_spline, .slider_commands',
        {
          y: '-50vh',
          duration: 4,
          translateZ: ctx.conditions.desktop ? -100 : 0
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
  const sliders = gsap.utils.toArray('.swiper-slide', section) as HTMLElement[]

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
          console.log('button', button)
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
