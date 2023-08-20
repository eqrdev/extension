import { ActionBadge } from './ActionBadge'
import { LinkedInUrl } from '../LinkedIn/Shared/LinkedInUrl'
import { equalizerRepository } from '../Equalizer/EqualizerRepository'
import { LinkedInClient } from 'linkedin'

export class ExtensionBackend {
  async load() {
    await chrome.storage.session.setAccessLevel({
      accessLevel: 'TRUSTED_AND_UNTRUSTED_CONTEXTS',
    })

    await chrome.runtime.onMessage.addListener(async ({ type }) => {
      switch (type) {
        case 'AddProfileName':
          await ActionBadge.hide()
          break
        case 'OpenSettings':
          chrome.runtime.openOptionsPage()
          break
      }
    })

    await chrome.runtime.onInstalled.addListener(async () => {
      await equalizerRepository.setDefaultSettings()
    })

    await this.onNavigate()

    await this.setActionBadgeIfNeeded()

    await this.onWebRequest()
  }

  async onNavigate() {
    await chrome.webNavigation.onCommitted.addListener(
      async ({ tabId }) => {
        await chrome.tabs.sendMessage(tabId, { type: 'Navigate' })
      },
      { url: [{ urlPrefix: LinkedInUrl.getBase() }] }
    )
    await chrome.webNavigation.onHistoryStateUpdated.addListener(
      async ({ tabId }) => {
        await chrome.tabs.sendMessage(tabId, { type: 'Navigate' })
      },
      { url: [{ urlPrefix: LinkedInUrl.getBase() }] }
    )
  }

  async onWebRequest() {
    const listener = ({
      url,
      requestHeaders,
    }: chrome.webRequest.WebRequestHeadersDetails) => {
      const match = url.match(/\/profiles\/([^/]+)\/versionTag/)
      const profileId = match ? match[1] : null
      const csrfToken = requestHeaders?.find(
        ({ name }) => name === 'csrf-token'
      )?.value
      if (csrfToken) {
        equalizerRepository.setSession('csrfToken', csrfToken)
      }

      equalizerRepository.setSession('profileId', profileId)
    }

    await chrome.webRequest.onBeforeSendHeaders.addListener(
      listener,
      {
        urls: [`${LinkedInClient.apiBaseUrl}identity/profiles/*`],
      },
      ['requestHeaders']
    )
  }

  async setActionBadgeIfNeeded() {
    await equalizerRepository.load(async ({ profileName }) => {
      if (profileName) {
        return
      }

      await ActionBadge.show()
    })
  }
}
