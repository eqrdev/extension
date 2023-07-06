import { ChromeStorageGateway } from '../Shared/ChromeStorageGateway'
import { Observable } from '../Shared/Observable'

interface EqualizerOptions {
  automaticMessage: string
  isOpenAiEnabled: boolean
  openAiKey?: string
  profileUrl?: string
}

const DEFAULT_AUTO_REPLY_TEXT = `
Hi! Thank You for contacting me.
Please check out my Equalizer Profile page and answer a few questions about the job that you are recruiting for.
Please follow this link: #URL#`

export class OptionsRepository {
  private chromeStorageGateway: ChromeStorageGateway<EqualizerOptions>
  private programmersModel: Observable<EqualizerOptions>

  constructor() {
    this.chromeStorageGateway = new ChromeStorageGateway<EqualizerOptions>()
    this.programmersModel = new Observable<EqualizerOptions>({
      automaticMessage: DEFAULT_AUTO_REPLY_TEXT,
      isOpenAiEnabled: false,
    })
  }

  async getOptions(callback) {
    this.programmersModel.subscribe(callback)
    this.programmersModel.value = await this.chromeStorageGateway.get()
    this.programmersModel.notify()
  }

  async setDefault() {
    return await this.chromeStorageGateway.setDefault({
      automaticMessage: DEFAULT_AUTO_REPLY_TEXT,
      isOpenAiEnabled: false,
    })
  }
}
