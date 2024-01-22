import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { Tray } from './Module/Tray/Tray'
import { AssetLocator } from './Shared/AssetLocator'
import Store from 'electron-store'
import { AutoConnectStoredData } from '../Types/AutoConnectStoredData'
import { Runner } from '../AutoConnect/Runner'
import { Scheduler } from '../AutoConnect/Scheduler'
import pie from 'puppeteer-in-electron'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const ASSETS_DIRECTORY = path.join(__dirname, '../../assets')
const assetLocator = new AssetLocator(ASSETS_DIRECTORY)
const store = new Store<AutoConnectStoredData>()

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    height: 300,
    width: 400,
    title: 'AutoConnect',
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: {
      x: 18,
      y: 18,
    },
    vibrancy: 'sidebar',
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
  })

  void mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  return mainWindow
}

app.commandLine.appendSwitch('remote-debugging-port', '8315')
app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1')
app.commandLine.appendSwitch('enable-features', 'NetworkService')

app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
})

app.dock.hide()

void pie.initialize(app)
app.on('ready', () => {
  ipcMain.handle('settings:get', () => store.get('settings'))
  ipcMain.handle('settings:set', (_, args) => store.set('settings', args))

  const window = createWindow()

  new Tray(assetLocator, () => {
    void app.dock.show()
  })

  const scheduler = new Scheduler(20000)
  scheduler.schedule(async () => {
    void Runner.run(store.get('settings'), window)
  })
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
