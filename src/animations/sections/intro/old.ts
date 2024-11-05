// import { ANIM_VAR } from '$/spot.config'
// import { drawPixels, generatePixelGrid } from '@/animations/pixels'
// import { ScrollTrigger, SplitText, gsap } from '@gsap'

// const name = "[data-section='intro']"

// const anim_sectionIntro = (_ctx: any) => {
//   const sections = gsap.utils.toArray(name) as HTMLElement[]
//   if (sections.length === 0) return

//   gsap.registerPlugin(SplitText, ScrollTrigger)

//   sections.forEach((section) => {
//     animation_pixels(section)
//     anim_section(section, _ctx)
//   })
// }

// export default anim_sectionIntro

// const animation_pixels = (section: HTMLElement) => {
//   const pixelContainers = Array.from(
//     section.querySelectorAll<HTMLDivElement>('[data-pixel-container]')
//   )
//   pixelContainers.forEach((container) => {
//     // Generate pixels grid for each container
//     const color = '255, 255, 255'
//     const { pixels, shuffledPixels, canvas, context } = generatePixelGrid({
//       container,
//       cols: 15,
//       color
//     })

//     const trigger = section.querySelector('.pixel_trigger')

//     if (!canvas || !context || pixels.length === 0) {
//       console.error('Pixel grid generation failed')
//       return
//     }
//     drawPixels({ pixels, context, canvas, color })
//     // Animate the shuffled pixels using GSAP
//     const tl = gsap.timeline({
//       scrollTrigger: {
//         trigger: trigger,
//         scrub: 1,
//         //markers: true,
//         start: 'top bottom',
//         end: 'top center'
//       }
//     })
//     tl.to(section, { pointerEvents: 'none', duration: 0 }).to(shuffledPixels, {
//       stagger: { amount: 1, from: 'random' },
//       opacity: 0, // Fade out pixel opacity
//       duration: ANIM_VAR.duration.default / 2, // Use ANIM_VAR for faster fade-out
//       onUpdate: () => drawPixels({ pixels, context, canvas, color }), // Redraw pixels every time opacity changes
//       ease: ANIM_VAR.ease.out // Use custom easing from ANIM_VAR
//     })
//   })
// }

// const anim_section = (section: HTMLElement, _ctx: any) => {
//   if (!section) return

//   const defaults: GSAPTweenVars = {
//     duration: ANIM_VAR.duration.default,
//     ease: ANIM_VAR.ease.out
//   }

//   gsap.context(() => {
//     const heading = '[data-intro-title]'
//     const text = '[data-intro-text]'
//     const mainWrapper = '.main-wrapper'

//     const split = new SplitText(heading, {
//       type: 'lines, chars',
//       linesClass: 'intro_title_line',
//       charsClass: 'intro_title_char'
//     })

//     gsap.set(split.chars, { autoAlpha: 0 })

//     const trigger = '.trigger_enter'
//     const endTrigger = '.trigger_exit'
//     const pixelTrigger = '.pixel_trigger'

//     const tlEnter = gsap.timeline({
//       defaults,
//       scrollTrigger: {
//         trigger: trigger,
//         endTrigger: endTrigger,
//         scrub: true,
//         //markers: true,
//         end: 'top bottom'
//       }
//     })
//     tlEnter
//       .to(split.chars, { autoAlpha: 1, stagger: 0.2, duration: 0 })
//       .from(text, { autoAlpha: 0, y: '2rem', duration: 3, delay: 5 }, 0)

//     const tlExit = gsap.timeline({
//       defaults,
//       scrollTrigger: {
//         trigger: pixelTrigger,
//         //endTrigger: pixelTrigger,
//         scrub: true,

//         start: 'top 75%',
//         end: 'top 50%'
//       }
//     })
//     tlExit
//       .to(mainWrapper, { autoAlpha: 0, duration: 0.01 })
//       .to(section, { pointerEvents: 'none', duration: 0.01 }, 0)
//   }, section)
// }
