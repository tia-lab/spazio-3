import gsap from 'gsap'

import {
  DrawSVGPlugin,
  Flip,
  RoughEase,
  ScrollTrigger,
  SplitText
} from 'gsap/all'

// Configuring GSAP
gsap.config({
  autoSleep: 120,
  nullTargetWarn: process.env.NODE_ENV === 'development' ? true : false
})

gsap.ticker.fps(100)

//Moved in the useGsapConfig hook
const SCROLLTRIGGER_CONFIG: ScrollTrigger.ConfigVars = {
  //autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  syncInterval: 100,
  limitCallbacks: true
}
const SCROLLTRIGGER_NORMALIZE = true
const SCROLLTRIGGER_DEFAULTS: ScrollTrigger.Vars = {}

export {
  DrawSVGPlugin,
  Flip,
  gsap,
  RoughEase,
  ScrollTrigger,
  SCROLLTRIGGER_CONFIG,
  SCROLLTRIGGER_DEFAULTS,
  SCROLLTRIGGER_NORMALIZE,
  SplitText
}
