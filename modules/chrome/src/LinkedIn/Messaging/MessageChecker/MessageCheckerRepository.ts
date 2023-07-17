import { ChromeStorageGateway } from '../../../Shared/ChromeStorageGateway'
import { Observable } from '../../../Shared/Observable'
import { EqualizerSettings } from '../../../Settings/SettingsRepository'
import { ConversationProcessor, LinkedInClient } from 'linkedin'
import { LinkedInHeaders } from '../../../Worker/LinkedInHeaders'
import { analyzeMessage } from 'openai'

export interface MessagingData extends EqualizerSettings {
  lastChecked: number
  headers: string
}

export class MessageCheckerRepository {
  private readonly chromeStorageGateway: ChromeStorageGateway<MessagingData>
  private programmersModel: Observable<MessagingData>

  constructor() {
    this.chromeStorageGateway = new ChromeStorageGateway<MessagingData>()
    this.programmersModel = new Observable<MessagingData>(null)
  }

  async getData(callback) {
    this.programmersModel.subscribe(callback)
    await this.loadData()
  }

  private async setDate(date: Date) {
    await this.chromeStorageGateway.set({ lastChecked: date.getTime() })
    await this.loadData()
  }

  private async loadData() {
    this.programmersModel.value = await this.chromeStorageGateway.getAll()
  }

  async checkMessages() {
    await this.replyMessages()
    await this.setDate(new Date())
  }

  private async replyMessages() {
    const client = new LinkedInClient({
      csrfToken: await LinkedInHeaders.getCsrfToken(),
    })
    const mailBoxUrn = (await chrome.storage.session.get()).mailboxUrn
    const conversations = await client.getConversations(mailBoxUrn)

    const conversationsToProcess = conversations.filter(conversation => {
      return (
        conversation.conversationParticipants.length === 2 &&
        conversation.lastActivityAt > this.programmersModel.value.lastChecked
      )
    })
    const conversationUrnIds = conversationsToProcess.map(conversation =>
      ConversationProcessor.getUrnId(conversation)
    )

    for (const urnId of conversationUrnIds) {
      const fullConversation = await client.getConversation(urnId)
      const notReplied =
        new Set([...fullConversation.map(message => message.sender.entityUrn)])
          .size === 1
      const conversationText = ConversationProcessor.getText(fullConversation)
      const hasOpenAiKey = !!this.programmersModel.value.openAiKey
      const isOpenAiValidated = hasOpenAiKey
        ? (
            await analyzeMessage(
              conversationText,
              this.programmersModel.value.openAiKey
            )
          ).is_recruiter_message
        : true

      const shouldReply = notReplied && isOpenAiValidated

      if (shouldReply) {
        await client.sendMessage(
          urnId,
          mailBoxUrn,
          this.programmersModel.value.automaticMessage
        )
      }
    }
  }
}
