import { ScrollTrigger, gsap } from '@gsap'

const name = "[data-section='portfolio']"

const anim_sectionPortfolio = (ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (sections.length === 0) return

  gsap.registerPlugin(ScrollTrigger)

  sections.forEach((section) => {
    ctx.conditions.desktop && anim_desktop(ctx, section)
  })
}

const anim_desktop = (_ctx: any, section: HTMLElement) => {
  gsap.context(() => {
    const numbers = gsap.utils.toArray(
      '[data-number]',
      section
    ) as HTMLElement[]
    numbers.forEach((number) => {
      if (Number(number.innerHTML) < 10 && !Number.isNaN(number.innerHTML)) {
        number.innerHTML = '0' + number.innerHTML
      }
    })
    const list = section.querySelector('.projects_list')

    const items = gsap.utils.toArray('.project', section) as HTMLElement[]

    const clone = items[items.length - 1].cloneNode(true) as HTMLElement
    clone.classList.add('is-last')
    list?.appendChild(clone)

    //exit
    anim_exit(_ctx, section)
  }, section)
}

const anim_exit = (_ctx: any, section: HTMLElement) => {
  gsap.context(() => {
    const trigger = '.exit_trigger'
    const wrapper = '.main-wrapper.is-portfolio'

    gsap.to(wrapper, {
      opacity: 0,
      scrollTrigger: {
        trigger,
        start: 'top bottom',
        end: 'top bottom',
        scrub: 1
        //markers: true
      }
    })
  }, section)
}

export default anim_sectionPortfolio
