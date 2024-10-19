import { MEDIA } from '@config'
import SCSSVars from '../types'

export const textVars = {
  text: {
    large: '1.5rem',
    main: '1rem',
    small: '0.875rem'
  },
  heading: {
    display: { default: '6rem', [MEDIA.tablet]: '2.75rem' },
    '1': { default: '4rem', [MEDIA.tablet]: '2.25rem' },
    '2': { default: '3rem', [MEDIA.tablet]: '2rem' },
    '3': { default: '2.25rem', [MEDIA.tablet]: '1.75rem' },
    '4': { default: '1.5rem', [MEDIA.tablet]: '1.375rem' },
    '5': { default: '1.75rem', [MEDIA.tablet]: '1.125rem' }
  }
}

export const texts: SCSSVars = [textVars, []]
