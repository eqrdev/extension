import { Invitation } from 'linkedin/src/types/Invitation'
import { Conversation, LinkedInClient, Message } from 'linkedin'

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

  async getConversation(conversationUrnId: string): Promise<Message[]> {
    return this.client.getConversation(conversationUrnId)
  }

  async getConversations(): Promise<Conversation[]> {
    return this.client.getConversations(this.profileId)
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
