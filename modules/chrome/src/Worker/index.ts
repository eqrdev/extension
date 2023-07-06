import { OptionsRepository } from '../Options/OptionsRepository'
import {
  ChromeMessageGateway,
  MessageType,
} from '../Shared/ChromeMessageGateway'

const optionsRepository = new OptionsRepository()
const chromeMessageGateway = new ChromeMessageGateway()

chromeMessageGateway.onMessage(
  MessageType.OpenOptions,
  chrome.runtime.openOptionsPage
)

optionsRepository.setDefault()
