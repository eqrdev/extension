import { Invitation } from 'linkedin/src/types/Invitation'
import { Entities, LinkedInClient } from 'linkedin'
import { InvitationView } from 'linkedin/src/types/common/Entities'

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

  static mapConversations(
    conversations: Entities.Conversation[]
  ): ConversationData[] {
    return conversations.map(
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

  static mapInvitations(invitations: InvitationView[]): Invitation[] {
    return invitations.map(
      ({ invitation, subtitle, title, sentTimeLabel }) => ({
        id: invitation.invitationId,
        sharedSecret: invitation.sharedSecret,
        message: invitation.message,
        genericInvitationType: invitation.genericInvitationType,
        invitationType: invitation.invitationType,
        invitationState: invitation.invitationState,
        senderTitle: subtitle.text,
        senderName: title.text,
        timeLabel: sentTimeLabel,
      })
    )
  }

  async getInvitations(): Promise<Invitation[]> {
    const response = await this.client.getInvites()
    return LinkedInAPIGateway.mapInvitations(response)
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
    return LinkedInAPIGateway.mapConversations(response)
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
