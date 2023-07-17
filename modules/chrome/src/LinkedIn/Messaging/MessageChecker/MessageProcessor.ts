import { MessengerConversation } from 'linkedin'

export class MessageProcessor {
  message: MessengerConversation

  constructor(message: MessengerConversation) {
    this.message = message
  }
}
