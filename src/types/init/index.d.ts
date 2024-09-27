export default interface Init {
  development: {
    dev: boolean
    localhost: string | string[]
    dev_host: string | string[]
  }
  production: {
    prod_host: string | string[]
  }
}
