import { Logger } from 'auto-connect'
import { IPC } from '../IPC/IPC'

export class ElectronLogger implements Logger {
  constructor(private ipc: IPC) {}
  log(entry: string): void {
    this.ipc.logToWindow(entry)
    console.log(entry)
  }
}
