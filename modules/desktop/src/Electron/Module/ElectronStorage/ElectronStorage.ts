import Store from 'electron-store'
import {
  AutoConnectConfig,
  MonitoringData,
  PersistentStorage,
} from 'auto-connect'

export type AutoConnectStoredData = {
  settings: AutoConnectConfig
  monitoring: MonitoringData
}
export class ElectronStorage<T> implements PersistentStorage<T> {
  constructor(
    private store: Store<AutoConnectStoredData>,
    private key: string,
  ) {}

  isEmpty(): boolean {
    return !this.store.has(this.key)
  }

  read() {
    return this.store.get(this.key) as T
  }

  save(data: T): void {
    return this.store.set(this.key, data)
  }
}

const store = new Store<AutoConnectStoredData>()
export const configStorage = new ElectronStorage<AutoConnectConfig>(
  store,
  'config',
)
export const monitoringStore = new ElectronStorage<MonitoringData>(
  store,
  'monitoring',
)
