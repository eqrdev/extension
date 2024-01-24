import { contextBridge } from 'electron'
import { IPC } from './Module/IPC/IPC'

contextBridge.exposeInMainWorld('autoConnect', IPC.getApi())
