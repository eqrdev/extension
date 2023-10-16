import {
  ConversationMessagesResponse,
  ConversationsResponse,
  Entities,
} from 'linkedin'
import { GeneralConversation } from '../Types/GeneralConversation'

export class VoyagerConversationProcessor {
  constructor(
    private conversations: ConversationsResponse,
    private resolvedConversations: ConversationMessagesResponse[]
  ) {}

  get generalConversations(): GeneralConversation[] {
    return this.conversations.data.messengerConversationsBySyncToken.elements.map(
      ({
        entityUrn,
        backendUrn,
        conversationUrl,
        conversationParticipants,
        categories,
        createdAt,
        lastActivityAt,
      }) => ({
        urn: entityUrn,
        messages: this.getFullConversationByBackendUrn(backendUrn).map(
          ({ sender, body }) => ({
            text: body.text,
            sender: sender.entityUrn,
          })
        ),
        participants: conversationParticipants.map(
          ({ entityUrn }) => entityUrn
        ),
        categories,
        createdAt,
        lastActivityAt,
        url: conversationUrl,
      })
    )
  }

  private getFullConversationByBackendUrn(urn: string): Entities.Message[] {
    return this.resolvedConversations.find(response =>
      response.data.messengerMessagesBySyncToken.elements.every(
        ({ backendUrn }) => backendUrn === urn
      )
    ).data.messengerMessagesBySyncToken.elements
  }
}
