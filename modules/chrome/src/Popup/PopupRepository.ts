import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'

export class PopupRepository {
  async openSettings() {
    return new ChromeMessageGateway().send({ type: 'OpenSettings' })
  }
}
