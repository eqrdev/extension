export const MessageType = {
  OpenSettings: 'OPEN_SETTINGS',
  SetDefaultSettings: 'SET_DEFAULT_SETTINGS',
}

type MessageKey = keyof typeof MessageType
export type MessageTypeValue = (typeof MessageType)[MessageKey]

export class ChromeMessageGateway {
  async sendMessage(message: MessageTypeValue) {
    return chrome.runtime.sendMessage(message)
  }

  async onMessage(message: MessageTypeValue, callback: () => unknown) {
    return chrome.runtime.onMessage.addListener(messageName => {
      if (message === messageName) callback()
    })
  }
}
