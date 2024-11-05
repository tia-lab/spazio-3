// import { ANIM_VAR, COLORS } from '$/spot.config'
// import { drawPixels, generatePixelGrid } from '@/animations/pixels'
// import { useKeyPress, useLenis } from '@/hooks'
// import { ScrollTrigger, gsap } from '@gsap'
// import { Application } from '@splinetool/runtime'
// //import { Application } from '@splinetool/runtime'

// const name = "[data-section='slider']"
// const startTrigger = '.trigger_enter'
// const exitTrigger = '.trigger_exit'
// const slidesWrap = '.slider_slides'
// const modal = document.querySelector('[data-modal="slider"]') as HTMLElement
// const modalText = modal.querySelector('[data-modal-content]') as HTMLElement
// const modalTitle = modal.querySelector('[data-modal-title]') as HTMLElement
// const modalClose = modal.querySelector('[data-modal-close]') as HTMLElement
// const lenis = useLenis()?.lenis

// const defaults: gsap.TweenVars = {
//   ease: ANIM_VAR.ease.out,
//   duration: ANIM_VAR.duration.default
// }

// const anim_sectionSlider = (ctx: any) => {
//   const sections = gsap.utils.toArray(name) as HTMLElement[]
//   if (sections.length === 0) return

//   gsap.registerPlugin(ScrollTrigger)

//   sections.forEach((section) => {
//     gsap.context(() => {
//       animation_pixels(section)
//       //animation_spline(section)
//       animation_enter(section, ctx)
//       animation_slides(section, ctx)
//       animation_exit(section, ctx)
//       animation_modal(section, ctx)
//     }, section)
//   })
// }

// /* Slider */
// const animation_spline = (section: HTMLElement) => {
//   const canvas = section.querySelector(
//     '.spline_slider_canvas'
//   ) as HTMLCanvasElement
//   if (!canvas) return
//   const spline = new Application(canvas)
//   const toRadians = (degrees: number) => degrees * (Math.PI / 180)

//   spline
//     .load('https://prod.spline.design/SY8HHwX38gBOSG9y/scene.splinecode')
//     .then(() => {
//       const obj = spline.findObjectByName('spaziotre') as any
//       gsap.set(obj.position, { x: 10, y: 0, z: 0 })
//       gsap.set(obj.rotation, {
//         x: toRadians(25),
//         y: toRadians(45),
//         z: toRadians(0)
//       })
//       gsap.set(obj.scale, { x: 0.9, y: 0.9, z: 0.9 })
//       console.log(obj.rotation)
//       const step2 = gsap.timeline({
//         //toggleActions: 'play reverse play reverse',
//         scrollTrigger: {
//           trigger: section,
//           start: 'center center',
//           end: 'center center',
//           scrub: 1
//         }
//       })
//       step2
//         .to(
//           obj.rotation,
//           { x: toRadians(-40), y: toRadians(-30), z: toRadians(0) },
//           '<'
//         )
//         .to(obj.scale, { x: 1.2, y: 1.2, z: 1.2 }, '<')
//     })
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
//   gsap.set(slidesWrap, { translateZ: -100, autoAlpha: 0 })
//   const tl = gsap.timeline({
//     defaults,
//     scrollTrigger: {
//       trigger: startTrigger,
//       start: 'top 60%',
//       end: 'top 20%',
//       scrub: true
//     }
//   })
//   tl.to(slidesWrap, { translateZ: 0, autoAlpha: 1, duration: 1 })
// }
// const animation_slides = (section: HTMLElement, _ctx: any) => {
//   const slides = gsap.utils.toArray('.slider_slide', section) as HTMLElement[]
//   const counters = gsap.utils.toArray(
//     '.slider_counter_item',
//     section
//   ) as HTMLElement[]
//   let currentIndex = 0 // Start at the first slide
//   const totalSlides = slides.length
//   let animating = false

//   // Set initial states
//   gsap.set(slides.slice(1), { autoAlpha: 0 })
//   gsap.set(counters.slice(1), { backgroundColor: COLORS.neutral600 })

//   function gotoSection(index: number) {
//     animating = true

//     const tl = gsap.timeline({
//       defaults: { duration: 1.25, ease: 'power1.inOut' },
//       onComplete: () => {
//         animating = false // Allow new transitions after completion
//       }
//     })

//     if (currentIndex !== index) {
//       tl.to(slides[currentIndex], { autoAlpha: 0 })
//         .to(counters[currentIndex], { backgroundColor: COLORS.neutral600 }, 0)
//         .to(slides[index], { autoAlpha: 1 }, 0)
//         .to(counters[index], { backgroundColor: COLORS.neutral100 }, 0)
//     }

//     currentIndex = index
//   }

//   // ScrollTrigger observer to detect scroll direction
//   ScrollTrigger.observe({
//     target: section,
//     type: 'wheel,touch,pointer',
//     onDown: () => {
//       // Go to the next slide if we are not already at the last slide
//       if (!animating && currentIndex < totalSlides - 1) {
//         gotoSection(currentIndex + 1)
//       }
//     },
//     onUp: () => {
//       // Go to the previous slide if we are not at the first slide
//       if (!animating && currentIndex > 0) {
//         gotoSection(currentIndex - 1)
//       }
//     },
//     tolerance: 500, // Adjust this based on how sensitive you want the scroll to be
//     preventDefault: true
//   })

//   // Start with the first slide
//   gotoSection(0)
// }

// /* Animation Exit */
// const animation_exit = (_section: HTMLElement, _ctx: any) => {
//   gsap.set(slidesWrap, { translateZ: -100, autoAlpha: 0 })
//   const tl = gsap.timeline({
//     defaults,
//     scrollTrigger: {
//       trigger: exitTrigger,
//       endTrigger: '.pixel_trigger',
//       start: 'top 60%',
//       end: 'top 20%',
//       scrub: true
//     }
//   })
//   tl.to([slidesWrap, '.slider_counter'], {
//     translateZ: -100,
//     autoAlpha: 0,
//     duration: 1
//   })
// }

// const animation_modal = (section: HTMLElement, _ctx: any) => {
//   gsap.set(modal, { autoAlpha: 0, display: 'none' })

//   const paths = gsap.utils.toArray('path', modalClose) as HTMLElement[]

//   const tlButton = gsap.timeline({
//     paused: true,
//     defaults: { ...defaults, duration: ANIM_VAR.duration.default / 2 }
//   })
//   tlButton
//     .to([paths[0], paths[1]], { yPercent: 100 })
//     .to([paths[2], paths[3]], { yPercent: -100 }, '<')
//     .to([paths[0], paths[2]], { xPercent: 100 })
//     .to([paths[1], paths[3]], { xPercent: -100 }, '<')

//   let isOpen = false
//   const tl = gsap.timeline({ defaults, paused: true })
//   tl.to(modal, { display: 'block', duration: 0 }).to(modal, { autoAlpha: 1 })
//   const sliders = gsap.utils.toArray('.slider_slide', section) as HTMLElement[]
//   sliders.forEach((slide) => {
//     gsap.context(() => {
//       const button = '.slider_slide_button'
//       const title = slide.querySelector(
//         '.slider_slide_title>.title-display'
//       ) as HTMLElement
//       const text = slide.querySelector('.slider_slide_text') as HTMLElement
//       ScrollTrigger.observe({
//         target: button,
//         onClick: () => {
//           if (isOpen) return
//           modalTitle.innerHTML = title.innerHTML
//           modalText.innerHTML = text.innerHTML
//           tl.play()
//           lenis?.stop()
//           isOpen = true
//         }
//       })
//     }, slide)
//   })

//   ScrollTrigger.observe({
//     target: modalClose,
//     onHover: () => {
//       tlButton.play()
//     },
//     onHoverEnd: () => {
//       tlButton.reverse()
//     },
//     onClick: () => {
//       if (!isOpen) return
//       tl.reverse().eventCallback('onReverseComplete', () => {
//         isOpen = false
//         lenis?.start()
//       })
//     }
//   })

//   useKeyPress({
//     key: 'Escape',
//     callback: () =>
//       tl.reverse().eventCallback('onReverseComplete', () => {
//         isOpen = false
//         lenis?.start()
//       })
//   })
// }

// export default anim_sectionSlider
