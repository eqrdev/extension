import { Logger } from '../Types/Logger'
import { BrowserWindow } from 'electron'

export class EqualizerLogger implements Logger {
  constructor(private browserWindow: BrowserWindow) {}

  log(message: string): void {
    console.log(`[EQUALIZER] ${message}`)
    this.browserWindow.webContents.send('log', message)
  }
}
