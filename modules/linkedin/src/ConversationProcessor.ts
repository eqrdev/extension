import { Message, MessengerConversation } from './types'

export class ConversationProcessor {
  static getUrnId(conversation: MessengerConversation): string {
    return conversation.entityUrn.match(/fsd_profile:([^)]+)/)[1]
  }

  static getText(messages: Message[]): string {
    return messages
      .map(message => message.body.text)
      .reverse()
      .join('\n')
  }
}
