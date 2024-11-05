import { ANIM_VAR } from '$/spot.config'
import { drawPixels, generatePixelGrid } from '@/animations/pixels'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='hero']"
const pixels = "[data-pixels='hero']"

const defaults: GSAPTweenVars = {
  ease: ANIM_VAR.ease.out
}

const anim_sectionHero = (_ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)

  sections.forEach((section) => {
    gsap.context(() => {
      anim_pixels(section)
    }, section)
  })
}

const anim_pixels = (section: HTMLElement) => {
  const pixelContainers = Array.from(
    document.querySelectorAll<HTMLDivElement>(pixels) // Adjust selector if necessary
  )

  console.log(document.querySelectorAll<HTMLDivElement>(pixels))

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
        '.hero_spline_wrap',
        { y: '-10vh', duration: 4, translateZ: -100 },
        '<'
      )
  })
}

export default anim_sectionHero
