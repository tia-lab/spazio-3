import { Init } from '@/types'

export default async function init(config: Init) {
  const { development, production } = config

  const LOCALHOST_URL = Array.isArray(development.localhost)
    ? development.localhost
    : [development.localhost]
  const DEV_URL = Array.isArray(development.dev_host)
    ? development.dev_host
    : [development.dev_host]
  const PROD_URL = Array.isArray(production.prod_host)
    ? production.prod_host
    : [production.prod_host]

  const localhostScripts = createScripts(LOCALHOST_URL)
  const devScripts = createScripts(DEV_URL)
  const prodScripts = createScripts(PROD_URL)

  document.addEventListener('DOMContentLoaded', () => {
    //@ts-ignore
    if (Webflow.env('editor') === undefined) {
      if (development.dev) {
        fetchScripts(LOCALHOST_URL[0], localhostScripts, devScripts)
      } else {
        fetchScripts(PROD_URL[0], prodScripts)
      }
    } else {
      console.log('Editor is loaded: do not load custom js')
    }
  })

  async function fetchScripts(
    url: string,
    primaryScripts: HTMLScriptElement[],
    fallbackScripts?: HTMLScriptElement[]
  ) {
    try {
      const response = await fetch(url, {})
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      insertScript(primaryScripts)
    } catch {
      if (fallbackScripts) {
        insertScript(fallbackScripts)
      } else {
        console.error('something went wrong, no scripts loaded')
      }
    }
  }

  function createScripts(arr: string[]): HTMLScriptElement[] {
    return arr.map((url) => {
      const s = document.createElement('script')
      s.src = url
      s.type = 'module'
      return s
    })
  }

  function insertScript(scriptArr: HTMLScriptElement[]) {
    scriptArr.forEach((script) => {
      document.body.appendChild(script)
    })
  }
}
