import { BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import { AutoConnectConfig, PersistentStorage } from 'auto-connect'

interface AutoConnectElectronAPI {
  getSettings: () => Promise<AutoConnectConfig | undefined>
  saveSettings: (settings: AutoConnectConfig) => Promise<void>
  onLogEntry: (callback: (entry: string) => void) => void
}

declare global {
  interface Window {
    autoConnect: AutoConnectElectronAPI
  }
}

export class IPC {
  private static Channels = {
    Settings: {
      Set: 'settings:set',
      Get: 'settings:get',
    },
    Log: 'log',
  }

  constructor(
    configStorage: PersistentStorage<AutoConnectConfig>,
    private browserWindow: BrowserWindow,
  ) {
    ipcMain.handle(IPC.Channels.Settings.Get, () => configStorage.read())
    ipcMain.handle(IPC.Channels.Settings.Set, (_, args) =>
      configStorage.save(args),
    )
  }

  logToWindow(entry: string) {
    this.browserWindow.webContents.send(IPC.Channels.Log, entry)
  }

  static getApi(): AutoConnectElectronAPI {
    return {
      getSettings: async () => ipcRenderer.invoke(IPC.Channels.Settings.Get),
      saveSettings: async (settings: AutoConnectConfig) =>
        ipcRenderer.invoke(IPC.Channels.Settings.Set, settings),
      onLogEntry: async (callback: (log: string) => void) =>
        ipcRenderer.on(IPC.Channels.Log, (_event, value) => callback(value)),
    }
  }
}
