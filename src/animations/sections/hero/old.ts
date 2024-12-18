// import { ANIM_VAR } from '$/spot.config'
// import { drawPixels, generatePixelGrid } from '@/animations/pixels'
// import { ScrollTrigger, gsap } from '@gsap'

// const name = "[data-section='hero']"
// const startTrigger = '.trigger_exit'
// const endTrigger = '.pixel_trigger'
// const splineWrap = '.hero_spline_wrap'
// const names = '.hero_name'
// const title = '.hero_title'
// const defaults: GSAPTweenVars = {
//   ease: ANIM_VAR.ease.out
// }
// const anim_sectionHero = (ctx: any) => {
//   ctx.conditions.desktop ? anim_desktop(ctx) : anim_mobile(ctx)
// }

// const anim_desktop = (ctx: any) => {
//   const sections = gsap.utils.toArray(name) as HTMLElement[]
//   if (sections.length === 0) return

//   gsap.registerPlugin(ScrollTrigger)

//   sections.forEach((section) => {
//     gsap.context(() => {
//       animation_pixels(section)
//       animation_enter(section, ctx)
//       animation_exit(section, ctx)
//     }, section)
//   })
// }

// const anim_mobile = (ctx: any) => {
//   const sections = gsap.utils.toArray(name) as HTMLElement[]
//   if (sections.length === 0) return

//   gsap.registerPlugin(ScrollTrigger)

//   sections.forEach((section) => {
//     gsap.context(() => {
//       animation_pixels(section)
//       animation_enter(section, ctx)
//       animation_exit(section, ctx)
//     }, section)
//   })
// }

// /* Animation Pixels */

// const animation_pixels = (section: HTMLElement) => {
//   const pixelContainers = Array.from(
//     section.querySelectorAll<HTMLDivElement>('[data-pixel-container]')
//   )
//   pixelContainers.forEach((container) => {
//     // Generate pixels grid for each container
//     const color = '0,0,0'
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
//     gsap.to(shuffledPixels, {
//       stagger: { amount: 1, from: 'random' },
//       scrollTrigger: {
//         trigger: trigger,
//         scrub: 1,
//         //markers: true,
//         start: 'top bottom',
//         end: 'top center'
//       },

//       opacity: 0, // Fade out pixel opacity
//       duration: ANIM_VAR.duration.default / 2, // Use ANIM_VAR for faster fade-out
//       onUpdate: () => drawPixels({ pixels, context, canvas, color }), // Redraw pixels every time opacity changes
//       ease: ANIM_VAR.ease.out // Use custom easing from ANIM_VAR
//     })
//   })
// }

// /* Animation Enter */
// const animation_enter = (_section: HTMLElement, _ctx: any) => {
//   const tl = gsap.timeline({
//     defaults
//   })

//   tl.to(['.main-wrapper', splineWrap], { opacity: 1 })
//     .from(names, {
//       opacity: 0,
//       translateZ: -25,
//       scale: 0.5,
//       duration: ANIM_VAR.duration.default / 3,
//       stagger: { each: 0.1, from: 'random' }
//     })
//     .from(title, { translateZ: -120, scale: 1, opacity: 0 }, '<')
//     .from(splineWrap, { translateZ: -100, duration: 1.5, scale: 0.5 }, '>-=0.5')
// }

// /* Animatio Exit */
// const animation_exit = (section: HTMLElement, _ctx: any) => {
//   gsap.context(() => {
//     const tl = gsap.timeline({
//       defaults,
//       scrollTrigger: {
//         trigger: startTrigger,
//         endTrigger: endTrigger,
//         //markers: true,
//         id: 'exit',
//         scrub: true
//       }
//     })

//     tl.to(names, {
//       opacity: 0,
//       translateZ: -25,
//       scale: 0.5,
//       duration: ANIM_VAR.duration.default / 3,
//       stagger: { each: 0.1, from: 'random' }
//     })
//       .to(title, { translateZ: -120, scale: 1.7, opacity: 0 }, '<')
//       .to(splineWrap, { translateZ: -100, duration: 1, scale: 0.25 }, '>-=0.5')

//       .to(splineWrap, { opacity: 0, delay: 0.2, duration: 0.25 }, '<')
//   }, section)
// }

// export default anim_sectionHero
