import { ANIM_VAR } from '$/spot.config'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='footer']"

const anim_sectionFooter = (ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)

  const isDesktop = ctx.conditions.desktop

  sections.forEach((section) => {
    const head = '.footer_head'
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
        trigger: head,
        start: isDesktop ? 'top 80%' : 'top bottom'
      }
    })
    tlHead.from(headItems, {
      autoAlpha: 0,
      y: '2rem',
      stagger: ANIM_VAR.duration.stagger
    })

    const tlLogo = gsap.timeline({
      defaults,
      scrollTrigger: { trigger: logo, start: 'center bottom' }
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
      .to(
        linkHeroz,
        {
          scale: 1.05,
          duration: ANIM_VAR.duration.goldenRatio,
          yoyo: true,
          repeat: -1
        },
        '>'
      )
  })
}

export default anim_sectionFooter
