import { Observable } from '../Shared/Observable'
import { OpenAIGateway } from '../Shared/Gateways/OpenAIGateway'
import { LinkedInAPIGateway } from '../Shared/Gateways/LinkedInAPIGateway'
import { CrossThreadGateway } from '../Shared/Gateways/CrossThreadGateway'
import { StorageGateway } from '../Shared/Gateways/StorageGateway'
import { DateTimeGateway } from '../Shared/Gateways/DateTimeGateway'
import { ProfileUrl } from '../Shared/ProfileUrl'
import { DOMGateway } from '../Shared/Gateways/DOMGateway'
import {
  ConversationEvaluator,
  DateEvaluator,
  GeneralConversation,
  InvitationEvaluator,
} from 'equalizer'
import { ConversationMonitor } from './ConversationMonitor'

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

  private getConversationEvaluator() {
    return new ConversationEvaluator(
      new DateEvaluator(Date),
      new OpenAIGateway(this.programmersModel.value.openAiKey)
    )
  }

  private getInvitationEvaluator() {
    return new InvitationEvaluator(
      new OpenAIGateway(this.programmersModel.value.openAiKey)
    )
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
    const invitationSenderNames: string[] = []

    for (const invitation of invitations) {
      if (invitation.genericInvitationType !== 'CONNECTION') {
        continue
      }

      const hasMessage = Boolean(invitation.message)

      const accept = () => {
        invitationSenderNames.push(invitation.senderName)
        invitationsAcceptedCount++
      }

      const openai = this.getOpenAiGateway()

      if (!openai.hasOpenAi()) {
        accept()
      } else if (hasMessage) {
        if (await openai.isRecruiterMessage(invitation.message)) {
          accept()
        }
      } else if (await openai.isRecruiterTitle(invitation.senderTitle)) {
        accept()
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
    await this.monitorConversations()
    await this.setDate(this.dateTimeGateway.now())
  }

  private isConversationOutOfDate({ lastActivityAt }: GeneralConversation) {
    const hasLastCheckedDate =
      typeof this.programmersModel.value.messagesLastCheckedDate === 'number'

    if (hasLastCheckedDate) {
      return (
        lastActivityAt < this.programmersModel.value.messagesLastCheckedDate
      )
    }

    return true
  }

  private getMessage(): string {
    const { profileName, automaticMessage } = this.programmersModel.value
    const profileUrl = new ProfileUrl(profileName)
    return profileUrl.replaceInText(automaticMessage)
  }

  private async monitorInvitations(): Promise<void> {
    const gateway = await this.getLinkedinGateway()
    const invitations = await gateway.getInvitations()
    const evaluator = await this.getInvitationEvaluator()

    let count = 0

    for (const invitation of invitations) {
      if (await evaluator.shouldAccept(invitation)) {
        await gateway.acceptInvitation(invitation)
        count++
      }
    }

    this.domGateway.dispatch('checked:invitation', {
      count,
    })
  }

  private async monitorConversations(): Promise<void> {
    const gateway = await this.getLinkedinGateway()
    const evaluator = await this.getConversationEvaluator()

    const conversationMonitor = new ConversationMonitor(
      gateway,
      evaluator,
      this.programmersModel.value.messagesLastCheckedDate,
      this.getMessage()
    )

    const respondedConversations = await conversationMonitor.monitorEnquiries()

    this.domGateway.dispatch('checked:messages', {
      count: respondedConversations.length,
    })
  }
}

const equalizerRepository = new EqualizerRepository()

export { equalizerRepository }
