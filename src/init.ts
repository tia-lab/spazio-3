import { ADMIN } from '$/spot.config'
import { init } from './utils'
init({
  development: {
    /* in orde to change env you have to build and commit */
    dev: ADMIN.dev,
    localhost: ADMIN.localhost,
    dev_host: ADMIN.host
  },
  production: {
    prod_host: ADMIN.host
  }
})
