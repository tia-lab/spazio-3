import { ANIM_VAR } from '$/spot.config'
import { drawPixels, generatePixelGrid } from '@/animations/pixels'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='intro']"
const pixels = "[data-pixels='intro']"

const anim_sectionIntro = (ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)

  sections.forEach((section) => {
    gsap.context(() => {
      anim_pixels(section, ctx)
    }, section)
  })
}

const anim_pixels = (section: HTMLElement, ctx: any) => {
  if (!ctx.conditions.desktop) return
  const pixelContainers = Array.from(
    document.querySelectorAll<HTMLDivElement>(pixels) // Adjust selector if necessary
  )

  pixelContainers.forEach((container) => {
    // Generate pixels grid for each container
    const { pixels, shuffledPixels, canvas, context } = generatePixelGrid({
      container,
      cols: 25,
      colorStart: '255,255,255',
      colorEnd: '0,0,0'
    })

    if (!canvas || !context || pixels.length === 0) {
      console.error('Pixel grid generation failed')
      return
    }

    drawPixels({ pixels, context, canvas })
    const animatingPixels = shuffledPixels.filter((pixel) => !pixel.isStatic)

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'bottom bottom',
          end: 'bottom top',
          scrub: true,
          fastScrollEnd: true
        }
      })
      .to(container, { bottom: '-10vh', duration: 4, ease: 'none' })
    tl.to(
      animatingPixels,
      {
        stagger: { amount: 2, from: 'random' },
        colorString: 'rgb(0, 0, 0)', // Animate to black
        duration: ANIM_VAR.duration.default / 2,
        onUpdate: () => drawPixels({ pixels, context, canvas }), // Redraw on each update
        ease: ANIM_VAR.ease.out
      },
      '<'
    ).to('.main-wrapper', { y: '-5vh', duration: 4 }, '<')
  })
}

export default anim_sectionIntro
