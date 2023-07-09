const MessageTypes = [
  'OpenSettings',
  'SetDefaultSettings',
  'ChangeUrl',
  'Load',
] as const

export type MessageType = (typeof MessageTypes)[number]

export class ChromeMessageGateway {
  private isBackground = false

  constructor(isBackground?: boolean) {
    this.isBackground = isBackground
  }

  async send(messageType: MessageType, tabId?: number) {
    if (this.isBackground) {
      await chrome.tabs.sendMessage(tabId, messageType)
    } else {
      await chrome.runtime.sendMessage(messageType)
    }
  }

  async on(messageType: MessageType, callback: () => unknown) {
    return chrome.runtime.onMessage.addListener(type => {
      if (messageType === type) callback()
    })
  }
}
