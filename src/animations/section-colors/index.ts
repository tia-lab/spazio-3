import { ScrollTrigger, gsap } from '@gsap'

const mode = ['dark', 'light', 'grey'] as const
type Mode = (typeof mode)[number]

const anim_section_color = (_ctx: any) => {
  ScrollTrigger.refresh()

  const body = document.body
  if (!body) return
  const wrapper = body.querySelector('.page-wrapper')
  const sections = gsap.utils.toArray(
    'section:not(.section_pixels), footer',
    wrapper
  )

  const topAttribute = 'data-section-top-color'
  const bottomAttribute = 'data-section-bottom-color'

  const currentTopMode: Mode = 'dark'
  const currentBottomMode: Mode = 'dark'

  body.setAttribute('data-section-top-color', currentTopMode)
  body.setAttribute('data-section-bottom-color', currentBottomMode)
  sections.forEach((section: any, i) => {
    if (!section.getAttribute('data-color')) return
    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom top',

      onEnter: () => {
        body.setAttribute(
          topAttribute,
          section.getAttribute('data-color') || currentTopMode
        )
      },
      onEnterBack: () => {
        body.setAttribute(
          topAttribute,
          section.getAttribute('data-color') || currentTopMode
        )
        if (i === 0) {
          body.setAttribute(
            bottomAttribute,
            section.getAttribute('data-color') || currentBottomMode
          )
        }
      }
    })
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom bottom',
      onEnter: () => {
        body.setAttribute(
          bottomAttribute,
          section.getAttribute('data-color') || currentBottomMode
        )
      },
      onEnterBack: () => {
        body.setAttribute(
          bottomAttribute,
          section.getAttribute('data-color') || currentBottomMode
        )
      }
    })
  })
}

export default anim_section_color
