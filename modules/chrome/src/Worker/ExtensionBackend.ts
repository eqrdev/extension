import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'
import { ActionBadge } from './ActionBadge'
import { LinkedInUrl, RouteName } from '../LinkedIn/Shared/LinkedInUrl'
import {
  EqualizerRepository,
  equalizerRepository,
} from '../Equalizer/EqualizerRepository'
import { LinkedInClient } from 'linkedin'

export class ExtensionBackend {
  messages: ChromeMessageGateway

  constructor() {
    this.messages = new ChromeMessageGateway({ isBackground: true })
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
      await equalizerRepository.setDefaultSettings()
    })

    await this.onNavigate()

    await this.setActionBadgeIfNeeded()

    await this.onWebRequest()
  }

  async onNavigate() {
    await chrome.webNavigation.onHistoryStateUpdated.addListener(
      async ({ tabId }) => {
        await this.messages.send({ type: 'Navigate', tabId })
      },
      { url: [{ urlPrefix: LinkedInUrl.getBase() }] }
    )
  }

  async onWebRequest() {
    const listener = ({
      url,
      requestHeaders,
    }: chrome.webRequest.WebRequestHeadersDetails) => {
      const csrfToken = requestHeaders?.find(
        ({ name }) => name === 'csrf-token'
      )?.value
      if (csrfToken) {
        equalizerRepository.setSession('csrfToken', csrfToken)
      }
      if (EqualizerRepository.isMessagesUrl(url)) {
        equalizerRepository.setSession(
          'mailboxUrn',
          EqualizerRepository.getMailBoxUrnFromUrl(url)
        )
      }
    }

    await chrome.webRequest.onBeforeSendHeaders.addListener(
      listener,
      {
        urls: [`${LinkedInClient.apiBaseUrl}*`],
      },
      ['requestHeaders']
    )
  }

  async setActionBadgeIfNeeded() {
    await equalizerRepository.load(async ({ profileName }) => {
      if (profileName) {
        return
      }

      await ActionBadge.set()
    })
  }
}
