import { ChromeStorageGateway } from '../Shared/ChromeStorageGateway'
import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'
import { Observable } from '../Shared/Observable'
import { LinkedInClient, Message } from 'linkedin'
import { OpenAIGateway } from '../Shared/OpenAIGateway'

export interface EqualizerSyncedData {
  automaticMessage: string
  openAiKey?: string
  profileName?: string
  invitationsLastCheckedDate?: number
  messagesLastCheckedDate?: number
}

export interface EqualizerSessionData {
  csrfToken: string
  profileId: string
  lastResponsesCount: number
  invitationsAcceptedCount: number
}

export type EqualizerModel = EqualizerSyncedData & EqualizerSessionData

const DEFAULT_AUTO_REPLY_TEXT = `Hi! Thank You for contacting me.
Please check out my Equalizer Profile page and answer a few questions about the job that you are recruiting for.
Please follow this link: #URL#`

export class EqualizerRepository {
  syncStorage: ChromeStorageGateway<EqualizerSyncedData>
  sessionStorage: ChromeStorageGateway<EqualizerSessionData>
  messageGateway: ChromeMessageGateway
  private programmersModel: Observable<EqualizerModel>

  constructor() {
    this.sessionStorage = new ChromeStorageGateway<EqualizerSessionData>({
      sessionOnly: true,
    })
    this.syncStorage = new ChromeStorageGateway<EqualizerSyncedData>()
    this.messageGateway = new ChromeMessageGateway({ isBackground: false })
    this.programmersModel = new Observable<EqualizerModel>(null)
  }

  async load(callback: (model: EqualizerModel) => void) {
    this.programmersModel.subscribe(callback)
    await this.updateModel()
  }

  async set(settingKey: keyof EqualizerSyncedData, value: string) {
    if (value === '') {
      throw new Error('EmptyValueError')
    }

    if (typeof value !== 'string') {
      throw new TypeError('IncorrectTypeError')
    }

    if (settingKey === 'profileName') {
      if (!/^[^\s/]+$/i.test(value)) {
        throw new Error('IncorrectFormatError')
      }

      await this.messageGateway.send({ type: 'AddProfileName' })
    }
    await this.syncStorage.set({ [settingKey]: value })
    await this.updateModel()
  }

  async remove(settingKey: keyof EqualizerSyncedData) {
    await this.syncStorage.remove(settingKey)
    await this.updateModel()
  }

  async setDefaultSettings() {
    await this.syncStorage.set({
      automaticMessage: DEFAULT_AUTO_REPLY_TEXT,
    })
    await this.updateModel()
  }

  async openSettings() {
    return this.messageGateway.send({ type: 'OpenSettings' })
  }

  private async updateModel() {
    this.programmersModel.value = {
      ...(await this.syncStorage.getAll()),
      ...(await this.sessionStorage.getAll()),
    }
  }

  private async setDate(date: Date) {
    await this.syncStorage.set({
      messagesLastCheckedDate: date.getTime(),
    })
    await this.updateModel()
  }

  async setSession(key: keyof EqualizerSessionData, value: string | number) {
    await this.sessionStorage.set({
      [key]: value,
    })
    await this.updateModel()
  }

  get client() {
    return new LinkedInClient({
      csrfToken: this.programmersModel.value.csrfToken,
    })
  }

  get openAi() {
    return new OpenAIGateway(this.programmersModel.value.openAiKey)
  }

  async checkInvitations() {
    const invitations = await this.client.getInvites()

    let invitationsAcceptedCount = 0

    for (const invitation of invitations) {
      if (invitation.genericInvitationType !== 'CONNECTION') {
        return
      }

      const hasMessage = Boolean(invitation.message)

      const accept = async () => {
        await this.client.acceptInvitation(
          invitation.id.toString(),
          invitation.sharedSecret
        )
        invitationsAcceptedCount++
      }

      if (!this.openAi.hasOpenAi) {
        await accept()
      }

      if (hasMessage) {
        if (await this.openAi.isRecruiterMessage(invitation.message)) {
          await accept()
        }

        return
      }

      if (await this.openAi.isRecruiterTitle(invitation.senderTitle)) {
        await accept()
      }
    }

    await this.setSession('invitationsAcceptedCount', invitationsAcceptedCount)
  }

  async checkMessages() {
    await this.replyMessages()
    await this.setDate(new Date())
  }

  private isWithinTwoWeeks(timestamp: number) {
    const now = Date.now()
    const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000
    return timestamp >= now && timestamp <= now + twoWeeksInMilliseconds
  }

  private async replyMessages() {
    const mailBoxUrn = this.programmersModel.value.profileId
    const conversations = await this.client.getConversations(mailBoxUrn)

    const conversationsToProcess = conversations.filter(conversation => {
      return (
        (conversation.categories.includes('PRIMARY_INBOX') ||
          conversation.categories.includes('INMAIL')) &&
        conversation.conversationParticipants.length === 2 &&
        conversation.lastActivityAt >
          this.programmersModel.value.messagesLastCheckedDate &&
        this.isWithinTwoWeeks(conversation.createdAt)
      )
    })

    const getUrnId = conversation =>
      conversation.entityUrn.match(/fsd_profile:([^)]+)/)[1]

    const conversationUrnIds = conversationsToProcess.map(conversation =>
      getUrnId(conversation)
    )

    const getText = (messages: Message[]): string =>
      messages
        .map(message => message.body.text)
        .reverse()
        .join('\n')

    let responsesCount = 0

    for (const urnId of conversationUrnIds) {
      const fullConversation = await this.client.getConversation(urnId)
      const notReplied =
        new Set([...fullConversation.map(message => message.sender.entityUrn)])
          .size === 1
      const conversationText = getText(fullConversation)
      const isOpenAiValidated = this.openAi.hasOpenAi
        ? await this.openAi.isRecruiterMessage(conversationText)
        : true

      const shouldReply = notReplied && isOpenAiValidated

      if (shouldReply) {
        responsesCount++

        await this.client.sendMessage(
          urnId,
          mailBoxUrn,
          this.programmersModel.value.automaticMessage
        )
      }
    }

    await this.setSession('lastResponsesCount', responsesCount)
  }
}

const equalizerRepository = new EqualizerRepository()

export { equalizerRepository }
