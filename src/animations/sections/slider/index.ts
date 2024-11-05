import { ANIM_VAR } from '$/spot.config'
import { drawPixels, generatePixelGrid } from '@/animations/pixels'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='slider']"
const pixels = "[data-pixels='slider']"

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
      colorStart: '0,0,0',
      colorEnd: '255,255,255'
    })

    if (!canvas || !context || pixels.length === 0) {
      console.error('Pixel grid generation failed')
      return
    }

    drawPixels({ pixels, context, canvas })

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom center',
          markers: true,
          scrub: true,
          fastScrollEnd: true
        }
      })
      .to(container, { bottom: '-10vh', duration: 4, ease: 'none' })
    tl.to(
      shuffledPixels,
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

export default anim_sectionSlider
