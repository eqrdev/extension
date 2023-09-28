import { v4 as uuid } from 'uuid'
import { Invitations } from './types/Invitations'
import {
  ConversationMessagesResponse,
  ConversationsResponse,
} from './types/Conversation'
import { Conversation, InvitationView, Message } from './types/common/Entities'

export interface LinkedInClientOptions {
  csrfToken: string
}

export class LinkedInClient {
  private options: LinkedInClientOptions
  public static apiBaseUrl = 'https://www.linkedin.com/voyager/api/'

  constructor(options: LinkedInClientOptions) {
    this.options = options
  }

  private generateTrackingIdAsCharacterString() {
    const randomIntArray = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 256)
    )
    const randByteArray = new Uint8Array(randomIntArray)
    const charArray = Array.from(randByteArray, byte =>
      String.fromCharCode(byte)
    )

    return charArray.join('')
  }

  private request(method: 'post' | 'get', url: string, options?: RequestInit) {
    const { headers, ...restOptions } = options
    return fetch(`${LinkedInClient.apiBaseUrl}${url}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Csrf-Token': this.options.csrfToken,
        ...headers,
      },
      ...restOptions,
    })
  }

  private async requestGraphQL(queryId: string, variables: string) {
    const res = await fetch(
      `${LinkedInClient.apiBaseUrl}voyagerMessagingGraphQL/graphql?queryId=${queryId}&variables=${variables}`,
      {
        headers: {
          Accept: 'application/graphql',
          'Csrf-Token': this.options.csrfToken,
        },
      }
    )
    return res.json()
  }

  private async post(url: string, options?: RequestInit) {
    return this.request('post', url, options)
  }

  private async get(url: string, options?: RequestInit) {
    return this.request('get', url, options)
  }

  public async sendMessage(
    conversationUrnId: string,
    mailboxUrnId: string,
    text: string
  ) {
    return this.post(
      `voyagerMessagingDashMessengerMessages?action=createMessage`,
      {
        body: JSON.stringify({
          dedupeByClientGeneratedToken: false,
          mailboxUrn: `urn:li:fsd_profile:${mailboxUrnId}`,
          message: {
            body: { attributes: [], text },
            conversationUrn: `urn:li:msg_conversation:(urn:li:fsd_profile:${conversationUrnId})`,
            originToken: uuid(),
            renderContentUnions: [],
          },
          trackingId: this.generateTrackingIdAsCharacterString(),
        }),
      }
    )
  }

  public async getConversation(conversationUrnId: string): Promise<Message[]> {
    const response: ConversationMessagesResponse = await this.requestGraphQL(
      'messengerMessages.8d15783c080e392b337ba57fc576ad21',
      `(conversationUrn:urn%3Ali%3Amsg_conversation%3A%28urn%3Ali%3Afsd_profile%3A${encodeURIComponent(
        conversationUrnId
      )}%29)`
    )
    return response.data.messengerMessagesBySyncToken.elements
  }

  public async getConversations(mailboxUrnId: string): Promise<Conversation[]> {
    const response: ConversationsResponse = await this.requestGraphQL(
      'messengerConversations.a5975e28c61274a917663e133c323f0f',
      `(mailboxUrn:urn%3Ali%3Afsd_profile%3A${mailboxUrnId})`
    )
    return response.data.messengerConversationsBySyncToken.elements
  }

  public async getInvites(): Promise<InvitationView[]> {
    const response: Invitations = await this.requestGraphQL(
      'voyagerRelationshipsDashInvitationViews.92f52706ef5898d18d9f60d184f01de9',
      `(invitationTypes:List(),filterCriteria:List(),includeInsights:true,start:0,count:3)`
    )

    return response.data.relationshipsDashInvitationViewsByReceived.elements
  }

  public async acceptInvitation(
    invitationId: string,
    sharedSecret: string
  ): Promise<void> {
    await this.post(
      `voyagerRelationshipsDashInvitations/urn%3Ali%3Afsd_invitation%3A${invitationId}?action=accept`,
      {
        body: JSON.stringify({
          invitationType: 'CONNECTION',
          sharedSecret,
        }),
        headers: {
          Accept: 'application/vnd.linkedin.normalized+json+2.1',
          'Content-Type': 'application/json; charset=UTF-8',
        },
      }
    )
  }
}
