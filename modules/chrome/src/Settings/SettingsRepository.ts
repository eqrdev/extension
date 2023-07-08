import { ChromeStorageGateway } from '../Shared/ChromeStorageGateway'
import { Observable } from '../Shared/Observable'

export interface EqualizerSettings {
  automaticMessage: string
  isOpenAiEnabled: boolean
  openAiKey?: string
  profileName?: string
}

const DEFAULT_AUTO_REPLY_TEXT = `Hi! Thank You for contacting me.
Please check out my Equalizer Profile page and answer a few questions about the job that you are recruiting for.
Please follow this link: #URL#`

export class SettingsRepository {
  private chromeStorageGateway: ChromeStorageGateway<EqualizerSettings>
  private programmersModel: Observable<EqualizerSettings>

  constructor() {
    this.chromeStorageGateway = new ChromeStorageGateway<EqualizerSettings>()
    this.programmersModel = new Observable<EqualizerSettings>(null)
  }

  async getSettings(callback) {
    this.programmersModel.subscribe(callback)
    await this.loadSettings()
  }

  async set(settingKey: keyof EqualizerSettings, value: string) {
    await this.chromeStorageGateway.set({ [settingKey]: value })
    await this.loadSettings()
  }

  async setDefaultSettings() {
    await this.chromeStorageGateway.set({
      automaticMessage: DEFAULT_AUTO_REPLY_TEXT,
      isOpenAiEnabled: false,
    })
    await this.loadSettings()
  }

  private async loadSettings() {
    this.programmersModel.value = await this.chromeStorageGateway.getAll()
  }
}
