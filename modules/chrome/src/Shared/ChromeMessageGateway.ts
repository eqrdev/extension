import { AdditionalOptions } from 'copy-webpack-plugin'

const MessageTypes = [
  'OpenSettings',
  'AddProfileName',
  'LinkedInApiCall',
  'Install',
  'Navigate',
  'NavigateToMessaging',
  'GetHeaders',
] as const

export type MessageType = (typeof MessageTypes)[number]

type MessagePayload = Record<string, string | number | boolean>

type Message<T extends MessagePayload = Record<string, never>> = {
  type: MessageType
  tabId?: number
} & T

export class ChromeMessageGateway {
  private readonly isBackground: boolean = false

  constructor(
    { isBackground }: { isBackground?: boolean } = { isBackground: false }
  ) {
    this.isBackground = isBackground
  }

  async send<T extends MessagePayload>(message: Message<T>) {
    if (this.isBackground) {
      await chrome.tabs.sendMessage(message.tabId, message)
    } else {
      await chrome.runtime.sendMessage(message)
    }
  }

  async on<T extends AdditionalOptions = Record<string, never>>(
    messageType: MessageType,
    callback: (payload?: Message<T>) => unknown
  ) {
    if (messageType === 'Install') {
      return chrome.runtime.onInstalled.addListener(() => {
        callback()
      })
    }

    return chrome.runtime.onMessage.addListener((message: Message<T>) => {
      if (message.type === messageType) callback(message)
    })
  }
}
