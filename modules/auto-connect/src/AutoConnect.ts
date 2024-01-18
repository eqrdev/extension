import { LinkedInService } from './LinkedInService'
import { ConversationEvaluator, InvitationEvaluator } from 'equalizer'
import { PersistentStorage } from './PersistentStorage'
import { Logger } from './Types/Logger'

export class AutoConnect {
  constructor(
    private persistentStorage: PersistentStorage,
    private linkedInService: LinkedInService,
    private invitationEvaluator: InvitationEvaluator,
    private conversationEvaluator: ConversationEvaluator,
    private logger: Logger,
    private message: string
  ) {}

  async monitorEnquiries() {
    this.logger.log('We check for pending invitations...')
    await this.monitorInvitations()
    this.logger.log('Invitations monitoring done.')
    await new Promise(r => setTimeout(r, 5000))
    this.logger.log('We check for pending conversations...')
    await this.monitorConversations()
    this.logger.log('Conversations monitoring done.')
  }

  async monitorInvitations() {
    const invitations = await this.linkedInService.getInvitations()

    this.logger.log(`Pending invitations count: ${invitations?.length}`)

    try {
      for (const invitation of invitations) {
        this.logger.log(
          `Invitation from a ${invitation.inviterTitle} ${
            this.persistentStorage.isChecked(invitation.urn)
              ? 'is already checked.'
              : 'not checked yet.'
          }`
        )

        if (this.persistentStorage.isChecked(invitation.urn)) {
          continue
        }

        const shouldAccept =
          await this.invitationEvaluator.shouldAccept(invitation)

        if (shouldAccept) {
          await this.linkedInService.acceptInvitation(invitation)
          this.logger.log(
            `Invitation from a ${invitation.inviterTitle} is accepted.`
          )
        }
        await this.persistentStorage.markInvitationChecked(invitation.urn)
      }
    } catch (error) {
      this.logger.log(`Monitoring ran into some error: ${error}`)
    }
  }

  async monitorConversations(): Promise<void> {
    try {
      const conversations = await this.linkedInService.getConversations()

      this.logger.log(`Pending conversations: ${conversations?.length}`)

      for (const conversation of conversations) {
        if (this.persistentStorage.isChecked(conversation.urn)) {
          continue
        }

        if (await this.conversationEvaluator.shouldReply(conversation)) {
          await this.linkedInService.replyMessage(
            conversation.url,
            this.message
          )
        }
        await this.persistentStorage.markMessageChecked(conversation.urn)
      }

      await this.persistentStorage.markMonitoringComplete()
      await this.linkedInService.closeSession()
      this.logger.log(`Page and session closed.`)
    } catch (error) {
      await this.linkedInService.closeSession()
      this.logger.log(`Monitoring conversations was unsuccessful: ${error}`)
    }
  }
}
