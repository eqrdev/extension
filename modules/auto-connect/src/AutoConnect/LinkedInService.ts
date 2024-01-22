import { PuppeteerBrowserService } from './PuppeteerBrowserService'
import { GeneralConversation, GeneralInvitation } from 'equalizer'
import { VoyagerInvitationsProcessor } from './VoyagerInvitationsProcessor'
import {
  ConversationMessagesResponse,
  ConversationsResponse,
  Entities,
  VoyagerInvitations,
} from 'linkedin'

export class LinkedInService {
  private browserService: PuppeteerBrowserService
  constructor(token: string, noHeadlessRun = false) {
    this.browserService = new PuppeteerBrowserService({
      baseUrl: 'https://www.linkedin.com/',
      cookies: [
        {
          name: 'li_at',
          value: token,
          domain: '.www.linkedin.com',
        },
      ],
      noHeadlessRun,
    })
  }

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
      '/mynetwork/invitation-manager/?invitationType=CONNECTION',
    )
    const cardSelector = `.invitation-card:has([href="https://www.linkedin.com/in/${encodeURIComponent(
      inviterId,
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
        urlPattern:
          /^https:\/\/www\.linkedin\.com\/voyager\/api\/voyagerMessagingGraphQL\/graphql\?queryId=messengerConversations\.([a-f\d]+)&variables=\(mailboxUrn:urn%3Ali%3Afsd_profile%3A([A-Za-z0-9%_-]+)\)$/,
      })
    const conversations =
      response.data.messengerConversationsBySyncToken.elements

    const generalConversations: GeneralConversation[] = []

    for (const {
      entityUrn,
      conversationUrl,
      conversationParticipants,
      categories,
      createdAt,
      lastActivityAt,
    } of conversations) {
      const fullConversation = await this.getFullConversation(conversationUrl)
      generalConversations.push({
        urn: entityUrn,
        messages: fullConversation.map(({ sender, body }) => ({
          text: body.text,
          sender: sender.entityUrn,
        })),
        participants: conversationParticipants.map(
          ({ entityUrn }) => entityUrn,
        ),
        categories,
        createdAt,
        lastActivityAt,
        url: conversationUrl,
      })
    }

    return generalConversations
  }

  async getFullConversation(fullUrl: string): Promise<Entities.Message[]> {
    const response =
      await this.browserService.interceptResponse<ConversationMessagesResponse>(
        {
          pathName: new URL(fullUrl).pathname,
          urlPattern: /messengerMessages/,
        },
      )
    return response.data.messengerMessagesBySyncToken.elements
  }

  async replyMessage(conversationUrl: string, message: string): Promise<void> {
    const page = await this.browserService.getPage()
    await page.goto(conversationUrl)
    await page.waitForSelector('.msg-form__contenteditable')
    await page.focus('.msg-form__contenteditable')
    await page.keyboard.type(message)
    await page.waitForSelector('.msg-form__send-button:not([disabled])')
    await page.click('.msg-form__send-button', {
      delay: Math.floor(Math.random() * (10 + 1)),
    })
  }

  async isUserLoggedIn(): Promise<boolean> {
    return this.browserService.runInSession<Promise<boolean>>(async () => {
      const response = await fetch(
        `https://www.linkedin.com/uas/authenticate`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      const json = await response.json()
      return json.status === 'success'
    })
  }

  async closeSession(): Promise<void> {
    await this.browserService.page.close()
    await this.browserService.browser.close()
  }
}
