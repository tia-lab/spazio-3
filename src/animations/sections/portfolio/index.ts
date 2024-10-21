import { ANIM_VAR } from '$/spot.config'
import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='portfolio']"

const anim_sectionPortfolio = (ctx: any) => {
  ctx.conditions.desktop && anim_sectionPortfolio_desktop(ctx)
}

const anim_sectionPortfolio_desktop = (ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)

  const defaults: GSAPTweenVars = {
    duration: ANIM_VAR.duration.default,
    ease: ANIM_VAR.ease.none
  }

  sections.forEach((section) => {
    const numbers = gsap.utils.toArray(
      '[data-number]',
      section
    ) as HTMLElement[]
    numbers.forEach((number) => {
      if (Number(number.innerHTML) < 10 && !Number.isNaN(number.innerHTML)) {
        number.innerHTML = '0' + number.innerHTML
      }
    })

    const items = gsap.utils.toArray('.project', section) as HTMLElement[]
    if (items.length === 0) return
    const start = ctx.conditions.landscape ? 'top top' : 'center 50%'

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: start,
        end: '+=8000',
        scrub: 1,
        pin: true,
        fastScrollEnd: true,
        onEnter: () => {
          ScrollTrigger.refresh()
        },
        snap: {
          snapTo: 'labels',
          duration: { min: 0.5, max: 1 },
          ease: 'power1.inOut',
          delay: 0.1
        }
      }
    })

    items.forEach((item, i) => {
      const body = item.querySelector('.project_body') as HTMLElement
      const head = item.querySelector('.project_head') as HTMLElement

      const largeImage = item.querySelector(
        '.project_image .project_image_inner'
      ) as HTMLElement
      const smallImage = item.querySelector(
        '.project_image_small .project_image_inner'
      ) as HTMLElement

      // Remove the scaling to keep the images within the container
      // gsap.set([largeImage, smallImage], { width: '140%', height: '140%' })

      // Set initial height and opacity to 0 for all except the first one
      if (i !== 0) {
        gsap.set(body, { height: 0 })
      }

      // Add label for snap functionality
      masterTimeline.add(`section-${i}`)

      // Create animation timeline for each project (item)
      const timeline = gsap.timeline({ defaults })

      // Animate the current section's body to open smoothly with easing
      timeline
        .to(body, {
          height: 'auto'
        })
        .to(
          head,
          {
            y: 0
          },
          '-=0.5'
        )

      // If there's a previous section, animate it to close smoothly
      if (i > 0) {
        const prevItem = items[i - 1]
        const prevBody = prevItem.querySelector('.project_body') as HTMLElement
        timeline.to(
          prevBody,
          {
            height: 0,

            onComplete: () => {
              ScrollTrigger.refresh()
            }
          },
          0
        )
      }

      // Parallax effect for the large and small images within the opened tab
      timeline.to(
        largeImage,
        {
          xPercent: -8, // Move to the left by 50px
          yPercent: -8, // Move upward by 50px
          duration: ANIM_VAR.duration.default * 2,
          ease: 'power1.inOut'
        },
        '>'
      )

      timeline.to(
        smallImage,
        {
          xPercent: 8, // Move to the right by 50px
          yPercent: 8, // Move downward by 50px
          duration: ANIM_VAR.duration.default * 2,
          ease: 'power1.inOut'
        },
        '<'
      )

      // Add the timeline for this tab to the masterTimeline
      masterTimeline.add(timeline, `+=${i * 0.25}`) // Slight overlap for smooth transitions
    })
  })
}

export default anim_sectionPortfolio
