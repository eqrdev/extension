import { ConversationMessagesResponse, LinkedInClient } from 'linkedin'
import {
  GeneralConversation,
  GeneralInvitation,
  LinkedInService,
  VoyagerConversationProcessor,
  VoyagerInvitationsProcessor,
} from 'equalizer'

export type ConversationData = {
  categories: string[]
  conversationParticipantsCount: number
  lastActivityAt: number
  createdAt: number
  entityUrn: string
}

export class LinkedInAPIGateway implements LinkedInService {
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

  async getInvitations(): Promise<GeneralInvitation[]> {
    const response = await this.client.getInvitations()
    const processor = new VoyagerInvitationsProcessor(response)
    return processor.generalInvitations
  }

  async acceptInvitation({
    urn,
    sharedSecret,
  }: GeneralInvitation): Promise<void> {
    return this.client.acceptInvitation(urn, sharedSecret)
  }

  async replyConversation({ urn }: GeneralConversation, message) {
    await this.client.sendMessage(urn, this.profileId, message)
  }

  async getConversations(): Promise<GeneralConversation[]> {
    const response = await this.client.getConversations(this.profileId)
    const resolvedConversations: ConversationMessagesResponse[] = []

    for (const { entityUrn } of response.data.messengerConversationsBySyncToken
      .elements) {
      const entityUrnId = entityUrn.match(/fsd_profile:([^)]+)/)[1]
      resolvedConversations.push(await this.client.getConversation(entityUrnId))
    }

    const processor = new VoyagerConversationProcessor(
      response,
      resolvedConversations
    )

    return processor.generalConversations
  }
}
