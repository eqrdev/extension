import { ChromeStorageGateway } from '../Shared/ChromeStorageGateway'
import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'
import { Observable } from '../Shared/Observable'
import { ConversationProcessor, LinkedInClient } from 'linkedin'
import { analyzeMessage } from 'openai'

export interface EqualizerModel {
  automaticMessage: string
  openAiKey?: string
  profileName?: string
  invitationsLastCheckedDate?: number
  messagesLastCheckedDate?: number
  openSettings: () => void
}

export interface EqualizerSessionData {
  csrfToken: string
  mailboxUrn: string
}

const DEFAULT_AUTO_REPLY_TEXT = `Hi! Thank You for contacting me.
Please check out my Equalizer Profile page and answer a few questions about the job that you are recruiting for.
Please follow this link: #URL#`

export class EqualizerRepository {
  private readonly syncStorage: ChromeStorageGateway<EqualizerModel>
  private readonly sessionStorage: ChromeStorageGateway<EqualizerSessionData>
  private readonly messageGateway: ChromeMessageGateway
  private programmersModel: Observable<EqualizerModel>

  constructor() {
    this.sessionStorage = new ChromeStorageGateway<EqualizerSessionData>({
      sessionOnly: true,
    })
    this.syncStorage = new ChromeStorageGateway<EqualizerModel>()
    this.messageGateway = new ChromeMessageGateway({ isBackground: false })
    this.programmersModel = new Observable<EqualizerModel>(null)
  }

  async load(callback: (model: EqualizerModel) => void) {
    this.programmersModel.subscribe(callback)
    await this.loadSettings()
  }

  async set(settingKey: keyof EqualizerModel, value: string) {
    if (typeof value !== 'string') {
      throw new TypeError('IncorrectTypeError')
    }

    if (value === '') {
      throw new Error('EmptyValueError')
    }

    if (settingKey === 'profileName') {
      await this.messageGateway.send({ type: 'AddProfileName' })
    }
    await this.syncStorage.set({ [settingKey]: value })
    await this.loadSettings()
  }

  async remove(settingKey: keyof EqualizerModel) {
    await this.syncStorage.remove(settingKey)
    await this.loadSettings()
  }

  async setDefaultSettings() {
    await this.syncStorage.set({
      automaticMessage: DEFAULT_AUTO_REPLY_TEXT,
    })
    await this.loadSettings()
  }

  async openSettings() {
    return this.messageGateway.send({ type: 'OpenSettings' })
  }

  private async loadSettings() {
    this.programmersModel.value = await this.syncStorage.getAll()
  }

  private async setDate(date: Date) {
    await this.syncStorage.set({
      messagesLastCheckedDate: date.getTime(),
    })
    await this.loadSettings()
  }

  static isMessagesUrl(url: string): boolean {
    return /messengerConversations\.[a-f0-9]*&variables=\(mailboxUrn:urn%3Ali%3Afsd_profile%[A-Za-z0-9]*-[A-Za-z0-9]*\)/gm.test(
      url
    )
  }

  static getMailBoxUrnFromUrl(url: string): string {
    return url.match(/fsd_profile%3A([^(&)]+)/)[1]
  }

  async setSession(key: keyof EqualizerSessionData, value: string) {
    await this.sessionStorage.set({
      [key]: value,
    })
  }

  async checkInvitations() {
    const client = new LinkedInClient({
      csrfToken: await this.sessionStorage.get('csrfToken'),
    })
    const invites = await client.getInvites()

    for (const invite of invites) {
      const { invitationId, sharedSecret } = invite.invitation

      await client.acceptInvitation(invitationId.toString(), sharedSecret)
    }
  }

  async checkMessages() {
    await this.replyMessages()
    await this.setDate(new Date())
  }

  private async replyMessages() {
    const client = new LinkedInClient({
      csrfToken: await this.sessionStorage.get('csrfToken'),
    })
    const mailBoxUrn = (await chrome.storage.session.get()).mailboxUrn
    const conversations = await client.getConversations(mailBoxUrn)

    const conversationsToProcess = conversations.filter(conversation => {
      return (
        conversation.conversationParticipants.length === 2 &&
        conversation.lastActivityAt >
          this.programmersModel.value.messagesLastCheckedDate
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
