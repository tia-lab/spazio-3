import { ANIM_VAR, COLORS } from '$/spot.config'
import { gsap } from 'gsap/all'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const directions = ['top', 'bottom'] as const
type Direction = (typeof directions)[number]
const name = "[data-section='pixels']"

const anim_sectionPixels = (_ctx: any) => {
  const sections = document.querySelectorAll(name) as NodeListOf<HTMLElement>
  if (!sections.length) return
  gsap.registerPlugin(ScrollTrigger)

  sections.forEach((section) => {
    if (!section) return
    const rows = 5
    const cols = 15
    gsap.set(section, {
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      zIndex: 2
    })

    const color = section.dataset.pixelColor || COLORS.neutral600
    const endColor = section.dataset.pixelColorEnd || COLORS.neutral100
    const pixelOpacity = Boolean(section.dataset.pixelOpacity) || false
    const direction: Direction =
      (section.dataset.pixelDirection as Direction | undefined) &&
      directions.includes(section.dataset.pixelDirection as Direction)
        ? (section.dataset.pixelDirection as Direction)
        : 'top'

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const el = document.createElement('div')
        el.classList.add('pixel')
        gsap.set(el, {
          width: '100%',
          paddingTop: '100%',
          backgroundColor: color
        })
        section.appendChild(el)
      }
    }

    const pixels = gsap.utils.toArray('.pixel', section) as HTMLElement[]

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: direction === 'top' ? 'center center' : 'top bottom',
        end: 'bottom top',
        scrub: 1,
        fastScrollEnd: true
      }
    })

    tl.to(pixels, {
      autoAlpha: pixelOpacity ? 0 : undefined,
      backgroundColor: endColor,
      yPercent: direction === 'top' ? -50 : 50,

      stagger: {
        from: 'random',
        amount: ANIM_VAR.duration.default,
        ease: ANIM_VAR.ease.in
      }
    })

    gsap.to(section, {
      yPercent: direction === 'top' ? -10 : 10,
      duration: ANIM_VAR.duration.default * 5,
      scrollTrigger: {
        trigger: section,
        start: 'center center',
        end: 'bottom top',
        scrub: 1
      }
    })
  })
}

// Initialize or export the function
export default anim_sectionPixels
