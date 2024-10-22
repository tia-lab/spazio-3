import { ANIM_VAR, COLORS } from '$/spot.config'
import { ScrollTrigger, SplitText, gsap } from '@gsap'

const name = "[data-section='intro']"

const anim_sectionIntro = (_ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(SplitText, ScrollTrigger)

  const defaults: GSAPTweenVars = {
    duration: ANIM_VAR.duration.default,
    ease: ANIM_VAR.ease.out
  }

  sections.forEach((section) => {
    const heading = '[data-intro-title]'
    const text = '[data-intro-text]'

    const split = new SplitText(heading, {
      type: 'lines, chars',
      linesClass: 'intro_title_line',
      charsClass: 'intro_title_char'
    })

    gsap.set(split.chars, { autoAlpha: 0, yPercent: 0 })
    gsap.set(split.chars, { color: COLORS.neutral600 })
    const tl = gsap.timeline({
      defaults,
      scrollTrigger: {
        trigger: section,
        scrub: 2,
        pin: true,
        start: 'center center',
        end: '+9000'
      }
    })
    tl.to(split.chars, { autoAlpha: 1, stagger: 0.2, duration: 0 }).from(
      text,
      { autoAlpha: 0, y: '2rem', duratio: 3 },
      '>-=1'
    )
  })
}

export default anim_sectionIntro
