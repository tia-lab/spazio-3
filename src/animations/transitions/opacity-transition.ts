import { ANIM_VAR } from '$/spot.config'
import { ITransitionPage } from '@barba/core'
import { gsap } from '@gsap'
import { animations } from '..'

const opacityTransition: ITransitionPage = {
  name: 'opacity-transition',
  //define transition absed on trigger
  from: {
    custom: ({ trigger }: { trigger: any }) => {
      return trigger.dataset.transition === 'opacity'
    }
  },
  leave(data): any {
    return gsap.to(data.current.container, {
      opacity: 0,
      y: '2rem',
      duration: ANIM_VAR.duration.default,
      ease: ANIM_VAR.ease.out
    })
  },
  enter(data): any {
    return gsap.from(data.next.container, {
      opacity: 0,
      duration: ANIM_VAR.duration.default,
      ease: ANIM_VAR.ease.out,
      onComplete: () => {
        animations()
      }
    })
  }
}

export default opacityTransition
