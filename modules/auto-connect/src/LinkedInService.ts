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
          ({ entityUrn }) => entityUrn
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
        }
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

  async closeSession(): Promise<void> {
    await this.browserService.browser.close()
  }
}
