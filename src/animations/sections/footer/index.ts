import { ANIM_VAR } from '$/spot.config'
import { drawPixels, generatePixelGrid } from '@/animations/pixels'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='footer']"
const pixels = "[data-pixels='footer']"

const anim_sectionFooter = (ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)

  sections.forEach((section) => {
    gsap.context(() => {
      //anim_pixels(section)
      anim_enter(section, ctx)
    }, section)
  })
}

export default anim_sectionFooter

const anim_enter = (section: HTMLElement, ctx: any) => {
  gsap.context(() => {
    const isDesktop = ctx.conditions.desktop

    const headItems = '.footer_title'
    const logo = '.footer_logo'
    const logo_svg = '.footer_logo svg path'
    const links = gsap.utils.toArray(
      '.footer_links_top, .link_underline',
      section
    )
    const bottom_line = section.querySelector('.top_line')
    const bottom_links = '.footer_bottom_links>div, .footer_bottom_links>a'
    const linkHeroz = '[data-link-heroz]'
    const copyright = section.querySelector('[data-copyright]')

    const defaults: GSAPTweenVars = {
      duration: ANIM_VAR.duration.default,
      ease: ANIM_VAR.ease.out
    }

    if (copyright) {
      const currentYear = new Date().getFullYear()
      copyright.innerHTML = currentYear.toString()
    }

    const tlHead = gsap.timeline({
      defaults,
      scrollTrigger: {
        trigger: logo,
        start: isDesktop ? 'top bottom' : 'top bottom'
      }
    })
    tlHead.from(headItems, {
      autoAlpha: 0,
      y: '2rem',
      stagger: ANIM_VAR.duration.stagger
    })

    const tlLogo = gsap.timeline({
      defaults,
      scrollTrigger: { trigger: logo, start: 'top bottom' }
    })
    gsap.set(logo_svg, { yPercent: 150 })
    gsap.set(logo, { xPercent: -70, yPercent: 41, opacity: 0 })
    gsap.set(bottom_line, { width: 0 })
    tlLogo
      .to(bottom_line, {
        width: '100%',
        duration: ANIM_VAR.duration.goldenRatio * 2
      })
      .to(logo, { opacity: 1 }, '<')
      .to(
        logo,
        {
          xPercent: 0,
          duration: ANIM_VAR.duration.default * 2
        },
        '<+=0.33'
      )
      .to(logo, { yPercent: 0 }, '>')
      .to(
        logo_svg,
        {
          yPercent: 0,
          stagger:
            ANIM_VAR.duration.default / (ANIM_VAR.duration.goldenRatio * 3)
        },
        '<+=0.33'
      )
      .from(
        links,
        { autoAlpha: 0, y: '2rem', stagger: ANIM_VAR.duration.stagger },
        '<+=0.33'
      )
      .from(
        bottom_links,
        {
          autoAlpha: 0,
          y: '2rem',
          stagger: ANIM_VAR.duration.stagger
        },
        '>'
      )
    ctx.conditions.desktop &&
      tlLogo.to(
        linkHeroz,
        {
          scale: 1.05,
          duration: ANIM_VAR.duration.goldenRatio,
          yoyo: true,
          repeat: -1
        },
        '>'
      )
  }, section)
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
    const staticPixels = shuffledPixels.filter((pixel) => pixel.isStatic)
    gsap.set(staticPixels, { opacity: 0 })

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 120%',
          end: 'top 40%',

          id: 'footer',
          scrub: true,
          fastScrollEnd: true
        }
      })
      .to(container, { yPercent: -70, duration: 4, ease: 'none' })
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
    )
      .to('.main-wrapper', { y: '-5vh', duration: 4 }, '<')
      .from('.main-wrapper', { opacity: 0, duration: 4 }, '<')
  })
}
