export const MessageType = {
  OpenOptions: 'OPEN_OPTIONS',
  SetDefaultOptions: 'SET_DEFAULT_OPTIONS',
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
