import SCSSVars from '../../types'

export const easeingsVars = {
  in: {
    quad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    cubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    quart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
    quint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    expo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    circ: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
    back: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)'
  },
  out: {
    quad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    cubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    quart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    quint: 'cubic-bezier(0.23, 1, 0.32, 1)',
    expo: 'cubic-bezier(0.19, 1, 0.22, 1)',
    circ: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
    back: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  },
  inOut: {
    quad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
    cubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    quart: 'cubic-bezier(0.77, 0, 0.175, 1)',
    quint: 'cubic-bezier(0.86, 0, 0.07, 1)',
    expo: 'cubic-bezier(1, 0, 0, 1)',
    circ: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
    back: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
}

export const easings: SCSSVars = [easeingsVars, []]
