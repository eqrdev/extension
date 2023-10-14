import { PuppeteerBrowserService } from './PuppeteerBrowserService'
import { LinkedInService } from './LinkedInService'
import {
  DateEvaluator,
  ConversationEvaluator,
  InvitationEvaluator,
  OpenAIEvaluator,
  ProfileUrl,
} from 'equalizer'
import { PersistentStorage } from './PersistentStorage'

export class AutoConnect {
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

  async monitorEnquiries() {
    const persistentStorage = new PersistentStorage(Date)

    const browserService = new PuppeteerBrowserService({
      baseUrl: 'https://www.linkedin.com/',
      cookies: [
        {
          name: 'li_at',
          value: this.sessionToken,
          domain: '.www.linkedin.com',
        },
      ],
    })
    const openAiEvaluator = new OpenAIEvaluator(this.openAiApiKey)
    const dateEvaluator = new DateEvaluator(Date)
    const invitationEvaluator = new InvitationEvaluator(openAiEvaluator)
    const conversationEvaluator = new ConversationEvaluator(
      dateEvaluator,
      openAiEvaluator
    )
    const linkedInService = new LinkedInService(browserService)
    const invitations = await linkedInService.getInvitations()

    for (const invitation of invitations) {
      if (persistentStorage.isChecked(invitation.urn)) {
        continue
      }

      if (await invitationEvaluator.shouldAccept(invitation)) {
        await linkedInService.acceptInvitation(invitation)
      }
      await persistentStorage.markInvitationChecked(invitation.urn)
    }

    await new Promise(r => setTimeout(r, 5000))

    const conversations = await linkedInService.getConversations()

    for (const conversation of conversations) {
      if (persistentStorage.isChecked(conversation.urn)) {
        continue
      }

      if (await conversationEvaluator.shouldReply(conversation)) {
        await linkedInService.replyMessage(conversation.url, this.message)
      }
      await persistentStorage.markMessageChecked(conversation.urn)
    }

    await persistentStorage.markMonitoringComplete()
    await browserService.browser.close()
  }
}
