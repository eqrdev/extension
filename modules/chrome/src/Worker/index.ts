import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'
import { SettingsRepository } from '../Settings/SettingsRepository'
import { LinkedInUrl } from '../LinkedIn/LinkedInUrl'

const chromeMessageGateway = new ChromeMessageGateway(true)

chromeMessageGateway.on('OpenSettings', chrome.runtime.openOptionsPage)

chrome.runtime.onInstalled.addListener(async () => {
  const settingsRepository = new SettingsRepository()
  await settingsRepository.setDefaultSettings()
})

chrome.webNavigation.onHistoryStateUpdated.addListener(
  async ({ tabId }) => {
    await chromeMessageGateway.send('ChangeUrl', tabId)
  },
  { url: [{ urlPrefix: new LinkedInUrl().getFullUrl('Messaging') }] }
)

chrome.webNavigation.onHistoryStateUpdated.addListener(
  async ({ tabId }) => {
    await chromeMessageGateway.send('Load', tabId)
  },
  { url: [{ urlPrefix: new LinkedInUrl().getFullUrl('Messaging') }] }
)
