declare global {
  interface Window {
    electronAPI: any
  }
}

window.electronAPI.onPuppeteer((value: string) => {
  console.log(value)
})

import '../UI/index'
