import { PuppeteerBrowserService } from './PuppeteerBrowserService'
import { LinkedInService } from './LinkedInService'
import {
  DateEvaluator,
  ConversationEvaluator,
  InvitationEvaluator,
  OpenAIEvaluator,
  ProfileUrl,
} from 'equalizer'

export class Equalizer {
  private _bs: PuppeteerBrowserService = null

  constructor(
    private sessionToken: string,
    private profileId: string,
    private automaticMessage?: string,
    private openAiApiKey?: string
  ) {}

  private get message() {
    const profileUrl = new ProfileUrl(this.profileId)
    return profileUrl.replaceInText(this.automaticMessage)
  }

  get browserService(): PuppeteerBrowserService {
    if (this._bs) {
      return this._bs
    }

    return new PuppeteerBrowserService({
      baseUrl: 'https://www.linkedin.com/',
      cookies: [
        {
          name: 'li_at',
          value: this.sessionToken,
          domain: '.www.linkedin.com',
        },
      ],
    })
  }

  async runMonitoring(): Promise<void> {
    const openAiEvaluator = new OpenAIEvaluator(this.openAiApiKey)
    const invitationEvaluator = new InvitationEvaluator(openAiEvaluator)
    const linkedInService = new LinkedInService(this.browserService)

    const invitations = await linkedInService.getInvitations()
    for (const invitation of invitations) {
      if (await invitationEvaluator.shouldAccept(invitation))
        await linkedInService.acceptInvitation(invitation)
    }
    await this.browserService.browser.close()
    this._bs = null
  }
  async runMonitoringForMessages() {
    const openAiEvaluator = new OpenAIEvaluator(this.openAiApiKey)
    const conversationEvaluator = new ConversationEvaluator(
      new DateEvaluator(Date),
      new Date(),
      openAiEvaluator
    )
    const linkedInService = new LinkedInService(this.browserService)
    const conversations = await linkedInService.getConversations()

    for (const conversation of conversations) {
      if (await conversationEvaluator.shouldReply(conversation)) {
        await linkedInService.replyMessage(conversation.url, this.message)
      }
    }
  }
  async run() {
    console.log('heeeey')
    console.log(this.message)
  }
}
