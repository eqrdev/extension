import { ExtensionBackend } from './ExtensionBackend'

const worker = new ExtensionBackend()

;(async () => {
  await worker.load()
})()
