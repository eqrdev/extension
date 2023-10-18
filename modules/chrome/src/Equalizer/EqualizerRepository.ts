import { Observable } from '../Shared/Observable'
import { OpenAIGateway } from '../Shared/Gateways/OpenAIGateway'
import { LinkedInAPIGateway } from '../Shared/Gateways/LinkedInAPIGateway'
import { CrossThreadGateway } from '../Shared/Gateways/CrossThreadGateway'
import { StorageGateway } from '../Shared/Gateways/StorageGateway'
import { DateTimeGateway } from '../Shared/Gateways/DateTimeGateway'
import {
  ConversationEvaluator,
  DateEvaluator,
  DEFAULT_AUTO_REPLY_TEXT,
  InvitationEvaluator,
  ProfileUrl,
} from 'equalizer'
import { DOMGateway } from '../Shared/Gateways/DOMGateway'

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
}

export type EqualizerModel = EqualizerSyncedData & EqualizerSessionData

export class EqualizerRepository {
  storageGateway = new StorageGateway()
  crossThreadGateway = new CrossThreadGateway()
  programmersModel = new Observable<EqualizerModel>(null)
  linkedInGateway: LinkedInAPIGateway = null
  openAiGateway: OpenAIGateway = null
  dateTimeGateway: DateTimeGateway = new DateTimeGateway()
  domGateway: DOMGateway = new DOMGateway()

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

    if (settingKey === 'automaticMessage') {
      if (!value.includes('#URL#')) {
        throw new Error('MissingUrlError')
      }
    }

    if (settingKey === 'openAiKey') {
      const openAi = this.getOpenAiGateway()
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
    this.programmersModel.value = {
      ...this.programmersModel.value,
      ...(await this.storageGateway.getAllData()),
    }
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

  getOpenAiGateway(): OpenAIGateway | undefined {
    if (this.openAiGateway !== null) {
      return this.openAiGateway
    }

    const apiKey = this.programmersModel.value.openAiKey

    if (apiKey) {
      this.openAiGateway = new OpenAIGateway(apiKey)
      return this.openAiGateway
    }

    return undefined
  }

  async checkInvitations() {
    const linkedin = await this.getLinkedinGateway()
    const invitations = await linkedin.getInvitations()
    const evaluator = new InvitationEvaluator(this.getOpenAiGateway())

    let invitationsAcceptedCount = 0
    const invitationSenderNames: string[] = []

    for (const invitation of invitations) {
      if (await evaluator.shouldAccept(invitation)) {
        invitationSenderNames.push(invitation.inviterName)
        invitationsAcceptedCount++
      }
    }

    this.domGateway.clickAcceptButtons(invitationSenderNames)

    this.dateTimeGateway.setTimeout(async () => {
      await this.checkMessages()
    }, 4000)

    this.domGateway.dispatch('checked:invitations', {
      count: invitationsAcceptedCount,
    })
  }

  async checkMessages() {
    await this.replyMessages()
    await this.setDate(new Date(this.dateTimeGateway.now()))
  }

  private async replyMessages() {
    const linkedin = await this.getLinkedinGateway()
    const conversations = await linkedin.getConversations()
    const openAiGateway = this.getOpenAiGateway()
    const evaluator = new ConversationEvaluator(
      new DateEvaluator(this.dateTimeGateway),
      openAiGateway
    )

    let responsesCount = 0
    const profileUrl = new ProfileUrl(this.programmersModel.value.profileName)
    const message = profileUrl.replaceInText(
      this.programmersModel.value.automaticMessage
    )

    for (const conversation of conversations) {
      const shouldReply = await evaluator.shouldReply(conversation)

      if (shouldReply) {
        responsesCount++

        await linkedin.replyConversation(conversation, message)
      }
    }

    this.domGateway.dispatch('checked:messages', {
      count: responsesCount,
    })
  }
}

const equalizerRepository = new EqualizerRepository()

export { equalizerRepository }
