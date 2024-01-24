import { app, BrowserWindow } from 'electron'
import { Tray } from './Module/Tray/Tray'
import { assetLocator } from './Shared/AssetLocator'
import puppeteer from 'puppeteer-core'
import { startAutoConnect } from 'auto-connect'
import { IPC } from './Module/IPC/IPC'
import {
  configStorage,
  monitoringStore,
} from './Module/ElectronStorage/ElectronStorage'
import { ElectronLogger } from './Module/ElectronLogger/ElectronLogger'
import fetch from 'node-fetch'
import path from 'node:path'

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = (): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 560,
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

app.setName('AutoConnect')

app.commandLine.appendSwitch('remote-debugging-port', '8315')
// app.commandLine.appendSwitch('remote-debugging-address', '127.0.0.1')
// app.commandLine.appendSwitch('enable-features', 'NetworkService')

app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true,
})

app.dock.hide()

const getBrowser = async (disableHeadless = false) => {
  return puppeteer.launch({
    executablePath: path.resolve(
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ),
    headless: disableHeadless ? false : 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
    ],
  })
}

const getBrowserWithWebsocket = async () => {
  const response = await fetch(`http://127.0.0.1:8315/json/version/list`)
  const debugEndpoints = await response.json()
  return puppeteer.connect({
    // @ts-ignore
    browserWSEndpoint: debugEndpoints['webSocketDebuggerUrl'],
    protocol: 'cdp',
  })
}

app.on('ready', async () => {
  const window = createWindow()
  window.webContents.on('did-finish-load', async () => {
    const logger = new ElectronLogger(ipc)

    if (configStorage.isEmpty()) {
      return
    }
    const browser = await getBrowser()

    startAutoConnect({
      dateProvider: Date,
      logger: logger,
      storage: monitoringStore,
      browser: browser,
      config: configStorage.read(),
    })
  })
  const ipc = new IPC(configStorage, window)
  new Tray(assetLocator, async () => {
    await app.dock.show()
    window.show()
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
