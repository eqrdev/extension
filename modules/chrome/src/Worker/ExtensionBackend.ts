import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'
import { ActionBadge } from './ActionBadge'
import { SettingsRepository } from '../Settings/SettingsRepository'
import { LinkedInHeaders } from './LinkedInHeaders'

export class ExtensionBackend {
  messages: ChromeMessageGateway
  settingsRepository: SettingsRepository

  constructor() {
    this.messages = new ChromeMessageGateway({ isBackground: true })
    this.settingsRepository = new SettingsRepository()
  }

  async load() {
    await chrome.storage.session.setAccessLevel({
      accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
    })

    await this.messages.on('OpenSettings', () =>
      chrome.runtime.openOptionsPage()
    )

    await this.messages.on('AddProfileName', async () => {
      await ActionBadge.remove()
    })

    await this.messages.on('Install', async () => {
      await this.settingsRepository.setDefaultSettings()
    })

    await this.messages.on('NavigateToMessaging', async ({ tabId }) => {
      await this.messages.send({ type: 'NavigateToMessaging', tabId })
    })

    await this.setActionBadgeIfNeeded()

    await LinkedInHeaders.setListener()
  }

  async setActionBadgeIfNeeded() {
    await this.settingsRepository.getSettings(async ({ profileName }) => {
      if (profileName) {
        return
      }

      await ActionBadge.set()
    })
  }
}
