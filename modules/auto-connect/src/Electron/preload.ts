import { contextBridge, ipcRenderer } from 'electron'
import { exposeStateIPC } from 'electron-state-ipc'
import { AutoConnectSettings } from '../Types/AutoConnectStoredData'

exposeStateIPC()

declare global {
  interface Window {
    autoConnect: {
      getSettings: () => Promise<AutoConnectSettings>
      saveSettings: (settings: AutoConnectSettings) => Promise<void>
      onLogEntry: (callback: (entry: string) => void) => void
    }
  }
}

contextBridge.exposeInMainWorld('autoConnect', {
  getSettings: async () => ipcRenderer.invoke('settings:get'),
  saveSettings: async (settings: AutoConnectSettings) =>
    ipcRenderer.invoke('settings:set', settings),
  onLogEntry: async (callback: (log: string) => void) =>
    ipcRenderer.on('log', (_event, value) => callback(value)),
})
