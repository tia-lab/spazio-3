import { gsap } from '@gsap'

export interface UseGsapContext {
  callback: () => void
  scope?: any
}

const useGsapContext = ({ callback, scope }: UseGsapContext) => {
  const ctx = gsap.context(() => {
    callback()
  }, scope)
  return () => ctx.revert()
}

export default useGsapContext
