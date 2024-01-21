import { contextBridge, ipcRenderer } from 'electron'
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
contextBridge.exposeInMainWorld('electronAPI', {
  onPuppeteer: (callback: (value: string) => void) =>
    ipcRenderer.on('from-puppeteer', (_event, value) => callback(value)),
})
