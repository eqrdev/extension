import { Observable } from '../Shared/Observable'
import { OpenAIGateway } from '../Shared/Gateways/OpenAIGateway'
import { LinkedInAPIGateway } from '../Shared/Gateways/LinkedInAPIGateway'
import { CrossThreadGateway } from '../Shared/Gateways/CrossThreadGateway'
import { StorageGateway } from '../Shared/Gateways/StorageGateway'
import { DateTimeGateway } from '../Shared/Gateways/DateTimeGateway'

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
  storageGateway = new StorageGateway()
  crossThreadGateway = new CrossThreadGateway()
  programmersModel = new Observable<EqualizerModel>(null)
  linkedInGateway: LinkedInAPIGateway = null
  openAiGateway: OpenAIGateway = null
  dateTimeGateway: DateTimeGateway = new DateTimeGateway()

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

      await this.crossThreadGateway.addProfileName()
    }

    if (settingKey === 'openAiKey') {
      const openAi = await this.getOpenAiGateway()
      if (!(await openAi.isKeyValid(value))) {
        throw new Error('IncorrectValueError')
      }
    }

    await this.storageGateway.setSyncedData(settingKey, value)
    await this.updateModel()
  }

  async remove(settingKey: keyof EqualizerSyncedData) {
    await this.storageGateway.removeSyncedData(settingKey)
    await this.updateModel()
  }

  async setDefaultSettings() {
    await this.storageGateway.setSyncedData(
      'automaticMessage',
      DEFAULT_AUTO_REPLY_TEXT
    )
    await this.updateModel()
  }

  async openSettings() {
    return this.crossThreadGateway.openSettings()
  }

  private async updateModel() {
    this.programmersModel.value = await this.storageGateway.getAllData()
  }

  private async setDate(date: Date) {
    await this.storageGateway.setSyncedData(
      'messagesLastCheckedDate',
      date.getTime()
    )
    await this.updateModel()
  }

  async setSession(key: keyof EqualizerSessionData, value: string | number) {
    await this.storageGateway.setSessionData(key, value)
    await this.updateModel()
  }

  async getLinkedinGateway() {
    if (this.linkedInGateway !== null) {
      return this.linkedInGateway
    }

    const allData = await this.storageGateway.getAllData()

    return new LinkedInAPIGateway({
      csrfToken: allData.csrfToken,
      profileId: allData.profileId,
    })
  }

  getOpenAiGateway() {
    if (this.openAiGateway !== null) {
      return this.openAiGateway
    }

    return new OpenAIGateway(this.programmersModel.value.openAiKey)
  }

  async checkInvitations() {
    const linkedin = await this.getLinkedinGateway()
    const invitations = await linkedin.getInvitations()

    let invitationsAcceptedCount = 0

    for (const invitation of invitations) {
      if (invitation.genericInvitationType !== 'CONNECTION') {
        return
      }

      const hasMessage = Boolean(invitation.message)

      const accept = async () => {
        await linkedin.acceptInvitation(
          invitation.id.toString(),
          invitation.sharedSecret
        )
        invitationsAcceptedCount++
      }

      const openai = this.getOpenAiGateway()

      if (!openai.hasOpenAi()) {
        await accept()
      }

      if (hasMessage) {
        if (await openai.isRecruiterMessage(invitation.message)) {
          await accept()
        }

        return
      }

      if (await openai.isRecruiterTitle(invitation.senderTitle)) {
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
    const now = this.dateTimeGateway.now().getTime()
    const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000
    return timestamp >= now - twoWeeksInMilliseconds
  }

  private async replyMessages() {
    const linkedin = await this.getLinkedinGateway()

    const conversations = await linkedin.getConversations()

    const conversationsToProcess = conversations.filter(
      ({
        categories,
        conversationParticipantsCount,
        lastActivityAt,
        createdAt,
      }) => {
        return (
          (categories.includes('PRIMARY_INBOX') ||
            categories.includes('INMAIL')) &&
          conversationParticipantsCount === 2 &&
          lastActivityAt >
            this.programmersModel.value.messagesLastCheckedDate &&
          this.isWithinTwoWeeks(createdAt)
        )
      }
    )

    const getUrnId = conversation =>
      conversation.entityUrn.match(/fsd_profile:([^)]+)/)[1]

    const conversationUrnIds = conversationsToProcess.map(conversation =>
      getUrnId(conversation)
    )

    let responsesCount = 0

    for (const urnId of conversationUrnIds) {
      const { entityUrns, conversationText } = await linkedin.getConversation(
        urnId
      )
      const openAi = this.getOpenAiGateway()
      const isOnlyOnePersonInConversation = new Set([...entityUrns]).size === 1
      const isOpenAiValidated = openAi.hasOpenAi()
        ? await openAi.isRecruiterMessage(conversationText)
        : true

      const shouldReply = isOnlyOnePersonInConversation && isOpenAiValidated

      if (shouldReply) {
        responsesCount++

        await linkedin.sendMessage(
          urnId,
          this.programmersModel.value.automaticMessage
        )
      }
    }

    await this.storageGateway.setSessionData(
      'lastResponsesCount',
      responsesCount
    )
  }
}

const equalizerRepository = new EqualizerRepository()

export { equalizerRepository }
