import { ANIM_VAR } from '$/spot.config'
import { ScrollTrigger, SplitText, gsap } from '@gsap'

const name = '.link-text'

const anim_linkText = (ctx: any) => {
  if (!ctx.conditions.desktop) return
  const els = gsap.utils.toArray(name) as HTMLElement[]
  if (els.length === 0) return
  gsap.registerPlugin(ScrollTrigger, SplitText)
  els.forEach((el) => {
    //clone the text and append
    const mask = el.querySelector('.link_text_mask')
    const text = el.querySelector('.text-btn, h2')
    const clone = text?.cloneNode(true)
    if (clone && mask) {
      ;(clone as HTMLElement).classList.add('is-clone')
      mask.appendChild(clone)
    }
    const line1 = gsap.utils.toArray(
      '.text-btn:not(.is-clone), h2:not(.is-clone)',
      el
    ) as HTMLElement[]
    const line2 = gsap.utils.toArray('.is-clone', el) as HTMLElement[]
    //split chars and wrap in span
    const split1 = new SplitText(line1, { type: 'chars, lines' })
    const split2 = new SplitText(line2, { type: 'chars, lines' })

    const defaults: GSAPTweenVars = {
      ease: ANIM_VAR.ease.out,
      duration: ANIM_VAR.duration.default / 2,
      stagger: ANIM_VAR.duration.default / (ANIM_VAR.duration.goldenRatio * 6)
    }

    const tl = gsap.timeline({ defaults, paused: true })
    tl.to(split1.chars, { yPercent: -110, autoAlpha: 1 }, 0).to(
      split2.chars,
      { yPercent: -100, autoAlpha: 1 },
      0
    )

    ScrollTrigger.observe({
      target: el,
      onHover: () => tl.play(),
      onHoverEnd: () => tl.reverse()
    })
  })
}

export default anim_linkText
