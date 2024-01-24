import { LinkedInService } from './LinkedInService'
import {
  ConversationEvaluator,
  DateEvaluator,
  DateProvider,
  InvitationEvaluator,
  OpenAIEvaluator,
} from 'equalizer'
import { MonitoringData, MonitoringStorage } from './MonitoringStorage'
import { Logger } from './Logger'
import { Browser } from 'puppeteer-core'
import { MessageProcessor } from './MessageProcessor'
import { PersistentStorage } from './PersistentStorage'

export type AutoConnectConfig = {
  username: string
  token: string
  message: string
  openAiKey: string
}

export class EnquiryMonitor {
  private readonly message: string
  private persistentStorage: MonitoringStorage
  private linkedInService: LinkedInService
  private invitationEvaluator: InvitationEvaluator
  private conversationEvaluator: ConversationEvaluator
  openAiKey: string
  constructor(
    private dateProvider: DateProvider,
    private logger: Logger,
    storage: PersistentStorage<MonitoringData>,
    browser: Browser,
    config: AutoConnectConfig,
  ) {
    this.persistentStorage = new MonitoringStorage(storage)
    this.linkedInService = new LinkedInService(browser, config.token)
    this.message = MessageProcessor.getMessageBasedOnProfileName(
      config.username,
      config.message,
    )
    this.openAiKey = config.openAiKey
  }

  async createEvaluators() {
    const dateEvaluator = new DateEvaluator(this.dateProvider)
    const hasOpenAi = await OpenAIEvaluator.isKeyValid(this.openAiKey)

    const openAiEvaluator = hasOpenAi
      ? new OpenAIEvaluator(this.openAiKey)
      : undefined
    this.invitationEvaluator = new InvitationEvaluator(openAiEvaluator)
    this.conversationEvaluator = new ConversationEvaluator(
      dateEvaluator,
      openAiEvaluator,
    )
  }

  async run() {
    await this.createEvaluators()
    this.logger.log('Created evaluators, trying to log in to LinkedIn')

    const isLoggedIn = await this.linkedInService.isUserLoggedIn()

    if (isLoggedIn) {
      this.logger.log('Logged in into LinkedIn')
    } else {
      this.logger.log(
        "We haven't managed to login to your LinkedIn account with the provided session token. Monitoring hasn't started.",
      )
      return
    }

    this.logger.log('We check for pending invitations...')
    await this.monitorInvitations()
    this.logger.log('Invitations monitoring done.')
    await new Promise((r) => setTimeout(r, 5000))
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
          }`,
        )

        if (this.persistentStorage.isChecked(invitation.urn)) {
          continue
        }

        const shouldAccept =
          await this.invitationEvaluator.shouldAccept(invitation)

        if (shouldAccept) {
          await this.linkedInService.acceptInvitation(invitation)
          this.logger.log(
            `Invitation from a ${invitation.inviterTitle} is accepted.`,
          )
        }
        this.persistentStorage.markInvitationChecked(invitation.urn)
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
            this.message,
          )
        }
        this.persistentStorage.markMessageChecked(conversation.urn)
      }

      this.persistentStorage.markMonitoringComplete(this.dateProvider.now())
    } catch (error) {
      await this.linkedInService.closeSession()
      this.logger.log(`Monitoring conversations was unsuccessful: ${error}`)
    }
  }
}
