import { LinkedInClient } from 'linkedin'

export class LinkedInHeaders {
  private static mailboxRegex = /fsd_profile%3A([^(&)]+)/
  private static getMessagesRegex =
    /messengerConversations\.[a-f0-9]*&variables=\(mailboxUrn:urn%3Ali%3Afsd_profile%[A-Za-z0-9]*-[A-Za-z0-9]*\)/gm

  static async setListener() {
    await chrome.webRequest.onBeforeSendHeaders.addListener(
      function (request) {
        LinkedInHeaders.saveLinkedInData(request, this)
      },
      {
        urls: [`${LinkedInClient.apiBaseUrl}*`],
      },
      ['requestHeaders']
    )
  }

  private static async saveLinkedInData(
    request: chrome.webRequest.WebRequestHeadersDetails,
    callback
  ) {
    if (LinkedInHeaders.getMessagesRegex.test(request.url)) {
      await chrome.storage.session.set({
        getMessagesUrl: request.url.replace(LinkedInClient.apiBaseUrl, ''),
        mailboxUrn: request.url.match(LinkedInHeaders.mailboxRegex)[1],
      })
    }
    const csrfToken = request.requestHeaders?.find(
      ({ name }) => name === 'csrf-token'
    )?.value

    if (csrfToken) {
      await chrome.storage.session.set({
        csrfToken,
      })
    }
    await chrome.webRequest.onBeforeSendHeaders.removeListener(callback)
  }

  static async getUrl(): Promise<string> {
    const { getMessagesUrl } = await chrome.storage.session.get()
    return getMessagesUrl
  }

  static async getCsrfToken(): Promise<string> {
    const { csrfToken } = await chrome.storage.session.get()
    return csrfToken
  }
}
