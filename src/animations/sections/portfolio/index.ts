import { ANIM_VAR } from '$/spot.config'
import { drawPixels, generatePixelGrid } from '@/animations/pixels'
import lenis from '@/hooks/use-lenis'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='portfolio']"
const pixels = "[data-pixels='portfolio']"

const defaults: GSAPTweenVars = {
  duration: ANIM_VAR.duration.default,
  ease: ANIM_VAR.ease.out
}
const anim_sectionPortfolio = (ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)

  sections.forEach((section) => {
    gsap.context(() => {
      const numbers = gsap.utils.toArray(
        '[data-number]',
        section
      ) as HTMLElement[]
      numbers.forEach((number) => {
        if (Number(number.innerHTML) < 10 && !Number.isNaN(number.innerHTML)) {
          number.innerHTML = '0' + number.innerHTML
        }
      })
      //anim_pixels(section)
      anim_accordion(ctx, section)
    }, section)
  })
}

export default anim_sectionPortfolio

const anim_accordion = (_ctx: any, section: HTMLElement) => {
  //const lenis = useLenis()?.lenis

  const items = gsap.utils.toArray(
    "[data-accordion='item']",
    section
  ) as HTMLElement[]

  items.forEach((item, i) => {
    const head = item.querySelector("[data-accordion='head']")
    const body = item.querySelector("[data-accordion='body']")
    const date = item.querySelector('.project_date')
    const open = item.querySelector('.project_open')
    if (i == 0) {
      gsap.set(body, { height: 'auto', overflow: 'visible' })
      gsap.set(date, { opacity: 0 })
      gsap.set(open, { opacity: 1 })
      item.classList.add('is-active')
    }

    ScrollTrigger.observe({
      target: head,
      onClick: () => {
        const isActive = item.classList.contains('is-active')
        const tl = gsap.timeline({ defaults })
        const tlReverse = gsap.timeline({ defaults })
        !isActive &&
          tl
            .to(body, {
              height: 'auto',
              onComplete: () => {
                item.classList.add('is-active')
                lenis?.scrollTo(item, { offset: -200 })
              }
            })
            .to(date, { opacity: 0 }, '<')
            .to(open, { opacity: 1 }, '>-=0.25')
        tlReverse
          .to(
            items
              .filter((el) => el !== item)
              .map((el) => el.querySelector("[data-accordion='body']")),
            {
              height: 0,
              overflow: 'hidden',
              ...defaults,
              onComplete: () => {
                ScrollTrigger.refresh()
                items
                  .filter((el) => el !== item)
                  .map((el) => el.classList.remove('is-active'))
              }
            }
          )
          .to(
            items
              .filter((el) => el !== item)
              .map((el) => el.querySelector('.project_open')),
            { opacity: 0 },
            '<'
          )
          .to(
            items
              .filter((el) => el !== item)
              .map((el) => el.querySelector('.project_date')),
            { opacity: 1 },
            '>-=0.25'
          )

        item.classList.toggle('is-active')
      }
    })
  })
}

const anim_pixels = (section: HTMLElement) => {
  const pixelContainers = Array.from(
    document.querySelectorAll<HTMLDivElement>(pixels) // Adjust selector if necessary
  )

  pixelContainers.forEach((container) => {
    // Generate pixels grid for each container
    const { pixels, shuffledPixels, canvas, context } = generatePixelGrid({
      container,
      cols: 25,
      colorStart: '255,255,255',
      colorEnd: '230,230,230'
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
        colorString: 'rgb(230, 230, 230)', // Animate to black
        duration: ANIM_VAR.duration.default / 2,
        onUpdate: () => drawPixels({ pixels, context, canvas }), // Redraw on each update
        ease: ANIM_VAR.ease.out
      },
      '<'
    ).to('.main-wrapper', { y: '-5vh', duration: 4 }, '<')
  })
}
