import { ExtensionBackend } from './ExtensionBackend'

new ExtensionBackend().load().then(() => {
  console.info('Extension backend initialized')
})
