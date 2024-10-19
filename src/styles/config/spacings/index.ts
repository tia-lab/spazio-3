import { MEDIA } from '@config'
import SCSSVars from '../types'

export const spacingVars = {
  space: {
    none: '0',
    '2xs': '0.125rem',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': { default: '3rem', [MEDIA.tablet]: '2.5rem' },
    '3xl': { default: '4rem', [MEDIA.tablet]: '3rem' },
    '4xl': { default: '6rem', [MEDIA.tablet]: '4.5rem' },
    '5xl': { default: '8rem', [MEDIA.tablet]: '6rem' }
  }
}

export const layoutSpacingVars = {
  base: '16',

  containerGutter: { default: '1.5rem', [MEDIA.tablet]: '1rem' },
  pageWidth: '2200px',
  padding: {
    global: { default: '1.5rem', [MEDIA.tablet]: '1rem' },
    vertical: {
      none: '0',
      small: { default: '2rem', [MEDIA.tablet]: '1.5rem' },
      main: { default: '4rem', [MEDIA.tablet]: '4rem' },
      large: { default: '8rem', [MEDIA.tablet]: '8rem' }
    }
  }
}

export const spacings: SCSSVars = [spacingVars, [{ mb: 'margin-bottom' }]]
export const layoutSpacings: SCSSVars = [layoutSpacingVars, []]
