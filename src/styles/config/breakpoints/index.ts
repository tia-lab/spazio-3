import { SPOT_CONFIG } from '$/spot.config'
import SCSSVars from '../types'

const breakpointsVars = {
  mobile: `${SPOT_CONFIG.breakpoints.mobile}px`,
  tablet: `${SPOT_CONFIG.breakpoints.tablet}px`
}

export const breakpoints: SCSSVars = [breakpointsVars, []]
