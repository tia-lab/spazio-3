import SCSSVars from '../types'

export const colorsVars = {
  white: '#fff',
  black: '#000',
  neutral100: '#fff',
  neutral200: '#f6f6f6',
  neutral300: '#E6E6E6',
  neutral400: '#737373',
  neutral500: '#2c2c2c',
  neutral600: '#000000',
  alpha: {
    medium: 'rgb(0 0 0 / 60%)'
  }
}

export const colors: SCSSVars = [
  colorsVars,
  [{ 'background-color': 'background-color' }, { text: 'color' }]
]
