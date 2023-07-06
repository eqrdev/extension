import {
  ChromeMessageGateway,
  MessageType,
} from '../Shared/ChromeMessageGateway'
import { SettingsRepository } from '../Settings/SettingsRepository'

const chromeMessageGateway = new ChromeMessageGateway()

chromeMessageGateway.onMessage(
  MessageType.OpenSettings,
  chrome.runtime.openOptionsPage
)

chrome.runtime.onInstalled.addListener(async () => {
  console.log('oninstalled')
  const settingsRepository = new SettingsRepository()
  await settingsRepository.setDefaultSettings()
})
