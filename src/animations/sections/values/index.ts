import { ANIM_VAR } from '$/spot.config'
import { drawPixels, generatePixelGrid } from '@/animations/pixels'
import { DrawSVGPlugin, ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='values']"
const pixels = "[data-pixels='values']"

const anim_sectionValues = (ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return
  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger)

  const isDesktop = ctx.conditions.desktop

  sections.forEach((section) => {
    gsap.context(() => {
      anim_pixels(section)
      const cards = gsap.utils.toArray('.card_values') as HTMLElement[]
      if (cards.length === 0) return

      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top center',
          end: 'bottom bottom',
          scrub: isDesktop
        }
      })

      cards.forEach((card, i) => {
        const iconPath = card.querySelectorAll('.card_values_icon_svg path')
        const text = card.querySelector('.card_values_text')
        const border = card.querySelector('.card_values_border svg rect')
        gsap.set(card, { y: `${i * 10.5}rem`, autoAlpha: 0 })

        gsap.set(text, { yPercent: 150 })
        gsap.set([border, iconPath], { drawSVG: '0%' })

        // Create a custom timeline for each card
        const cardTimeline = gsap.timeline({
          defaults: {
            duration: ANIM_VAR.duration.default,
            ease: ANIM_VAR.ease.out
          }
        })

        // Define custom animations for each card in its timeline
        cardTimeline
          .to(card, {
            y: 0,
            autoAlpha: 1
          })
          .to(
            border,
            {
              drawSVG: '100%',
              ease: 'none',
              duration: ANIM_VAR.duration.default * 2
            },
            0
          )
          .to(iconPath, {
            drawSVG: '100%',
            stagger: { amount: ANIM_VAR.duration.default, from: 'random' }
          })
          .to(text, {
            autoAlpha: 1,
            yPercent: 0,
            stagger: ANIM_VAR.duration.default / ANIM_VAR.duration.goldenRatio
          })
          .to(
            iconPath,
            {
              fillOpacity: 1,
              stagger: { amount: ANIM_VAR.duration.default, from: 'random' }
            },
            '<'
          )

        // Add each card's timeline to the master timeline with a slight stagger
        masterTimeline.add(cardTimeline, i * 0.3)
      })
    }, section)
  })
}

const anim_sectionValues_tillTablet = (_ctx: any) => {
  const els = gsap.utils.toArray(name) as HTMLElement[]
  if (els.length === 0) return

  gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger)

  els.forEach((el) => {
    const cards = gsap.utils.toArray('.card_values') as HTMLElement[]
    if (cards.length === 0) return

    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top center',
        end: 'bottom bottom',
        scrub: true
      }
    })

    cards.forEach((card, i) => {
      const iconPath = card.querySelectorAll('.card_values_icon_svg path')
      const text = card.querySelector('.card_values_text')
      const border = card.querySelector('.card_values_border svg rect')
      gsap.set(card, { y: `${i * 10.5}rem`, autoAlpha: 0 })

      gsap.set(text, { yPercent: 150 })
      gsap.set([border, iconPath], { drawSVG: '0%' })

      // Create a custom timeline for each card
      const cardTimeline = gsap.timeline({
        defaults: {
          duration: ANIM_VAR.duration.default,
          ease: ANIM_VAR.ease.out
        }
      })

      // Define custom animations for each card in its timeline
      cardTimeline
        .to(card, {
          y: 0,
          autoAlpha: 1
        })
        .to(
          border,
          {
            drawSVG: '100%',
            ease: 'none',
            duration: ANIM_VAR.duration.default * 2
          },
          0
        )
        .to(iconPath, {
          drawSVG: '100%',
          stagger: { amount: ANIM_VAR.duration.default, from: 'random' }
        })
        .to(text, {
          autoAlpha: 1,
          yPercent: 0,
          stagger: ANIM_VAR.duration.default / ANIM_VAR.duration.goldenRatio
        })
        .to(
          iconPath,
          {
            fillOpacity: 1,
            stagger: { amount: ANIM_VAR.duration.default, from: 'random' }
          },
          '<'
        )

      // Add each card's timeline to the master timeline with a slight stagger
      masterTimeline.add(cardTimeline, i * 0.3)
    })
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
          end: 'bottom 40%',
          markers: true,
          scrub: true,
          fastScrollEnd: true
        }
      })
      .to(container, { bottom: '0', duration: 4, ease: 'none' })
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

export default anim_sectionValues
