import {
  ChromeMessageGateway,
  MessageType,
} from '../Shared/ChromeMessageGateway'

export class PopupRepository {
  private chromeMessageGateway: ChromeMessageGateway

  constructor() {
    this.chromeMessageGateway = new ChromeMessageGateway()
  }

  async openOptions() {
    return this.chromeMessageGateway.sendMessage(MessageType.OpenOptions)
  }
}
