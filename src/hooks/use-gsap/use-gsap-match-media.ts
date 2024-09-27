import { gsap } from '@gsap'

export interface UseGsapMatchMedia {
  media: object | string
  callback: (c: any) => void
  scope?: any
}

const useGsapMatchMedia = ({ media, callback, scope }: UseGsapMatchMedia) => {
  const ctx = gsap.matchMedia()
  ctx.add(
    media,
    (c) => {
      callback(c)
    },
    scope
  )
  return () => ctx.revert()
}

export default useGsapMatchMedia
