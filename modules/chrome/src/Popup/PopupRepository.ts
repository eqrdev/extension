import {
  ChromeMessageGateway,
  MessageType,
} from '../Shared/ChromeMessageGateway'

export class PopupRepository {
  async openSettings() {
    return new ChromeMessageGateway().sendMessage(MessageType.OpenSettings)
  }
}
