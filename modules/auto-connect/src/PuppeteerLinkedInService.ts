import { PuppeteerBrowserService } from './PuppeteerBrowserService'
import {
  GeneralConversation,
  GeneralInvitation,
  LinkedInService,
  VoyagerConversationProcessor,
  VoyagerInvitationsProcessor,
} from 'equalizer'
import {
  ConversationMessagesResponse,
  ConversationsResponse,
  VoyagerInvitations,
} from 'linkedin'

export class PuppeteerLinkedInService implements LinkedInService {
  constructor(private browserService: PuppeteerBrowserService) {}

  async getInvitations(): Promise<GeneralInvitation[]> {
    const response =
      await this.browserService.interceptResponse<VoyagerInvitations>({
        pathName: '/mynetwork/invitation-manager/?invitationType=CONNECTION',
        urlPattern: /voyagerRelationshipsDashInvitationViews/,
      })
    const processor = new VoyagerInvitationsProcessor(response)
    return processor.generalInvitations
  }

  async acceptInvitation({ inviterId }: GeneralInvitation): Promise<void> {
    await this.browserService.goToPathName(
      '/mynetwork/invitation-manager/?invitationType=CONNECTION'
    )
    const cardSelector = `.invitation-card:has([href="https://www.linkedin.com/in/${encodeURIComponent(
      inviterId
    )}"])`
    await this.browserService.page.waitForSelector(cardSelector)
    const card = await this.browserService.page.$(cardSelector)
    const button = await card.$('.artdeco-button--secondary')
    await button.click()
  }

  async getConversations(): Promise<GeneralConversation[]> {
    const response =
      await this.browserService.interceptResponse<ConversationsResponse>({
        pathName: '/messaging/',
        urlPattern: /100c46ef5ba532f401dd4255b7a7509b/,
      })

    const resolvedConversations: ConversationMessagesResponse[] = []

    for (const { conversationUrl } of response.data
      .messengerConversationsBySyncToken.elements) {
      resolvedConversations.push(
        await this.getFullConversation(conversationUrl)
      )
    }

    const processor = new VoyagerConversationProcessor(
      response,
      resolvedConversations
    )

    return processor.generalConversations
  }

  async getFullConversation(
    fullUrl: string
  ): Promise<ConversationMessagesResponse> {
    return this.browserService.interceptResponse<ConversationMessagesResponse>({
      pathName: new URL(fullUrl).pathname,
      urlPattern: /messengerMessages/,
    })
  }

  async replyConversation({ url }: GeneralConversation, message) {
    const page = await this.browserService.getPage()
    await page.goto(url)
    await page.waitForSelector('.msg-form__contenteditable')
    await page.focus('.msg-form__contenteditable')
    await page.keyboard.type(message)
    await page.waitForSelector('.msg-form__send-button:not([disabled])')
    await page.click('.msg-form__send-button', {
      delay: Math.floor(Math.random() * (10 + 1)),
    })
  }
}
