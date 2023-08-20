import { Invitation } from 'linkedin/src/types/Invitation'
import { LinkedInClient } from 'linkedin'

export type ConversationData = {
  categories: string[]
  conversationParticipantsCount: number
  lastActivityAt: number
  createdAt: number
  entityUrn: string
}

export type ConversationMessage = {
  entityUrns: string[]
  conversationText: string
}

export class LinkedInAPIGateway {
  client: LinkedInClient
  profileId: string

  constructor({
    csrfToken,
    profileId,
  }: {
    csrfToken: string
    profileId: string
  }) {
    this.client = new LinkedInClient({
      csrfToken,
    })
    this.profileId = profileId
  }

  async getInvitations(): Promise<Invitation[]> {
    return this.client.getInvites()
  }

  async getConversation(
    conversationUrnId: string
  ): Promise<ConversationMessage> {
    const response = await this.client.getConversation(conversationUrnId)
    return {
      entityUrns: response.map(({ sender }) => sender.entityUrn),
      conversationText: response
        .map(message => message.body.text)
        .reverse()
        .join('\n'),
    }
  }

  async getConversations(): Promise<ConversationData[]> {
    const response = await this.client.getConversations(this.profileId)
    return response.map(
      ({
        categories,
        conversationParticipants,
        lastActivityAt,
        createdAt,
        entityUrn,
      }) => ({
        categories,
        lastActivityAt,
        createdAt,
        entityUrn,
        conversationParticipantsCount: conversationParticipants.length,
      })
    )
  }

  async acceptInvitation(
    invitationId: string,
    sharedSecret: string
  ): Promise<void> {
    return this.client.acceptInvitation(invitationId, sharedSecret)
  }

  async sendMessage(conversationId: string, text: string): Promise<Response> {
    return this.client.sendMessage(conversationId, this.profileId, text)
  }
}
