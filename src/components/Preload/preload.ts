import { MEDIA, USE } from '$/spot.config'
import { useGsapMatchMedia } from '@/hooks'
import { gsap } from '@gsap'
import './preload.scss'

export const preload = () => {
  if (USE.preload === false) return
  const preload = document.querySelector('[data-preload]')
  if (!preload) return

  //check session storage
  const session = sessionStorage.getItem('preload')
  if (session === 'true') {
    preload.remove()
    return
  }

  //watch session

  useGsapMatchMedia({
    media: MEDIA,
    callback: (_c) => {
      const progress = '.preload_progress'
      gsap.set(progress, { width: '0%' })
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('preload', 'true')
        },
      })
      tl.to(progress, { width: '100%', duration: 2, ease: 'power1.inOut' })
        .to(preload, { autoAlpha: 0, duration: 1, ease: 'power1.inOut' })
        .to(preload, { display: 'none', onComplete: () => preload.remove() })
    },
    scope: preload,
  })
  console.log(preload)
}
