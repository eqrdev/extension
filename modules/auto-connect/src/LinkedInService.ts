import { GeneralConversation, GeneralInvitation } from 'equalizer'
import { VoyagerInvitationsProcessor } from './VoyagerInvitationsProcessor'
import {
  ConversationMessagesResponse,
  ConversationsResponse,
  Entities,
  VoyagerInvitations,
} from 'linkedin'
import { Browser } from 'puppeteer-core'

export class LinkedInService {
  private static BaseUrl = 'www.linkedin.com'
  constructor(
    private browser: Browser,
    private token: string,
  ) {}

  private get baseUrl(): string {
    return `https://${LinkedInService.BaseUrl}/`
  }

  private get cookieDomain(): string {
    return `.${LinkedInService.BaseUrl}`
  }

  async getPageByPath(pathName?: string) {
    const page = await this.browser.newPage()
    await page.goto(this.baseUrl + pathName)
    await page.setCookie({
      name: 'li_at',
      value: this.token,
      domain: this.cookieDomain,
    })
    return page
  }

  async interceptResponse<T>({
    pathName = '',
    urlPattern,
  }: {
    pathName: string
    urlPattern: RegExp
  }): Promise<T> {
    const page = await this.getPageByPath(pathName)
    const response = await page.waitForResponse(
      (response) => urlPattern.test(response.url()),
      {
        timeout: 20_000,
      },
    )
    const result = await response.json()
    await page.close()
    return result
  }

  async getInvitations(): Promise<GeneralInvitation[]> {
    const response = await this.interceptResponse<VoyagerInvitations>({
      pathName: '/mynetwork/invitation-manager/?invitationType=CONNECTION',
      urlPattern: /voyagerRelationshipsDashInvitationViews/,
    })
    const processor = new VoyagerInvitationsProcessor(response)
    return processor.generalInvitations
  }

  async acceptInvitation({ inviterId }: GeneralInvitation): Promise<void> {
    const page = await this.getPageByPath(
      '/mynetwork/invitation-manager/?invitationType=CONNECTION',
    )
    const cardSelector = `.invitation-card:has([href="https://www.linkedin.com/in/${encodeURIComponent(
      inviterId,
    )}"])`
    await page.waitForSelector(cardSelector)
    const card = await page.$(cardSelector)
    const button = await card.$('.artdeco-button--secondary')
    await button.click()
    await new Promise((r) => setTimeout(r, 100))
    await page.close()
  }

  async getConversations(): Promise<GeneralConversation[]> {
    const response = await this.interceptResponse<ConversationsResponse>({
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
    const response = await this.interceptResponse<ConversationMessagesResponse>(
      {
        pathName: new URL(fullUrl).pathname,
        urlPattern: /messengerMessages/,
      },
    )
    return response.data.messengerMessagesBySyncToken.elements
  }

  async replyMessage(conversationUrl: string, message: string): Promise<void> {
    const page = await this.getPageByPath(conversationUrl)
    await page.waitForSelector('.msg-form__contenteditable')
    await page.focus('.msg-form__contenteditable')
    await page.keyboard.type(message)
    await page.waitForSelector('.msg-form__send-button:not([disabled])')
    await page.click('.msg-form__send-button', {
      delay: Math.floor(Math.random() * (10 + 1)),
    })
    await new Promise((r) => setTimeout(r, 100))
    await page.close()
  }

  async isUserLoggedIn(): Promise<boolean> {
    const page = await this.getPageByPath('uas/authenticate')
    const string = await page.$eval('pre', (el) => el.textContent)
    const json = JSON.parse(string)
    await new Promise((r) => setTimeout(r, 100))
    await page.close()
    return json.status === 'success'
  }

  async closeSession(): Promise<void> {
    await this.browser.close()
  }
}
