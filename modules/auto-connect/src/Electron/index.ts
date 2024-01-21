import { app, BrowserWindow } from 'electron'
import path from 'node:path'
import { Tray } from './Module/Tray/Tray'
import { AssetLocator } from './Shared/AssetLocator'
import Store from 'electron-store'
import { AutoConnectStoredData } from '../Types/AutoConnectStoredData'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const ASSETS_DIRECTORY = path.join(__dirname, '../../assets')
const store = new Store<AutoConnectStoredData>()
const isStoreEmpty = Object.keys(store.store).length === 0

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'sidebar',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  })

  void mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

app.dock.hide()
app.on('ready', () => {
  if (isStoreEmpty) {
    createWindow()
  }

  new Tray(new AssetLocator(ASSETS_DIRECTORY), createWindow)
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
