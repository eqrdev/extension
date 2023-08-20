import { ChromeStorage } from '../ChromeStorage'
import {
  EqualizerSessionData,
  EqualizerSyncedData,
} from '../../Equalizer/EqualizerRepository'

type EqualizerModel = EqualizerSessionData & EqualizerSyncedData

export class StorageGateway {
  sessionStorage = new ChromeStorage<EqualizerSessionData>({
    sessionOnly: true,
  })

  syncedStorage = new ChromeStorage<EqualizerSyncedData>()

  async setSyncedData(
    settingKey: keyof EqualizerSyncedData,
    value: number | string
  ): Promise<void> {
    await this.syncedStorage.set({ [settingKey]: value })
  }

  async setSessionData(
    settingKey: keyof EqualizerSessionData,
    value: number | string
  ): Promise<void> {
    await this.sessionStorage.set({ [settingKey]: value })
  }

  async removeSyncedData(settingKey: keyof EqualizerSyncedData) {
    await this.syncedStorage.remove(settingKey)
  }

  async getAllData(): Promise<EqualizerSessionData & EqualizerSyncedData> {
    return {
      ...(await this.syncedStorage.getAll()),
      ...(await this.sessionStorage.getAll()),
    }
  }

  async get(
    settingKey: keyof EqualizerModel
  ): Promise<EqualizerModel[typeof settingKey]> {
    return (await this.getAllData())[settingKey]
  }
}
