import Store from 'electron-store'
import { AutoConnectStoredData } from '../../../Types/AutoConnectStoredData'

export class PersistentStorage {
  store: Store<AutoConnectStoredData>
  constructor() {
    this.store = new Store<AutoConnectStoredData>()
  }

  get<T>(key: string): T {
    return this.store.get(key)
  }
}
