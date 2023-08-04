import { generateTrackingIdAsCharString } from './generateTrackingIdAsCharString'

import { v4 as uuid } from 'uuid'
import { Invitations } from './types/Invitations'
import { VoyagerInvitations } from './types/VoyagerInvitations'
import {
  ConversationMessagesResponse,
  ConversationsResponse,
} from './types/Conversation'
import { Conversation, Message } from './types/common/Entities'
import {
  CompanyInclude,
  ContentSeriesInclude,
  InviteInclude,
  ProfileInclude,
} from './types/common/VoyagerEntities'
import { Invitation } from './types/Invitation'

export interface LinkedInClientOptions {
  csrfToken: string
}

export class LinkedInClient {
  private options: LinkedInClientOptions
  public static apiBaseUrl = 'https://www.linkedin.com/voyager/api/'

  constructor(options: LinkedInClientOptions) {
    this.options = options
  }

  private request(method: 'post' | 'get', url: string, options?: RequestInit) {
    return fetch(`${LinkedInClient.apiBaseUrl}${url}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Csrf-Token': this.options.csrfToken,
      },
      ...options,
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
          trackingId: generateTrackingIdAsCharString(),
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

  public async getInvites(): Promise<Invitation[]> {
    const isVoyagerResponse = (
      response: Invitations | VoyagerInvitations
    ): response is VoyagerInvitations =>
      Array.isArray((response as VoyagerInvitations).included)

    const isInvitation = (
      entity:
        | CompanyInclude
        | ContentSeriesInclude
        | InviteInclude
        | ProfileInclude
    ): entity is InviteInclude =>
      entity.$type ===
      'com.linkedin.voyager.dash.relationships.invitation.Invitation'

    const response: Invitations | VoyagerInvitations =
      await this.requestGraphQL(
        'voyagerRelationshipsDashInvitationViews.92f52706ef5898d18d9f60d184f01de9',
        `(invitationTypes:List(),filterCriteria:List(),includeInsights:true,start:0,count:3)`
      )

    if (isVoyagerResponse(response)) {
      const invitationElements =
        response.data.data.relationshipsDashInvitationViewsByReceived.elements

      return response.included.filter(isInvitation).map<Invitation>(invite => {
        const senderTitle = invitationElements.find(
          invitationElement =>
            invitationElement['*invitation'] === invite.entityUrn
        ).subtitle.text

        return {
          id: invite.invitationId,
          sharedSecret: invite.sharedSecret,
          message: invite.message,
          genericInvitationType: invite.genericInvitationType,
          invitationType: invite.invitationType,
          invitationState: invite.invitationState,
          senderTitle,
        }
      })
    }

    return response.data.relationshipsDashInvitationViewsByReceived.elements.map(
      ({ invitation, subtitle }) => ({
        id: invitation.invitationId,
        sharedSecret: invitation.sharedSecret,
        message: invitation.message,
        genericInvitationType: invitation.genericInvitationType,
        invitationType: invitation.invitationType,
        invitationState: invitation.invitationState,
        senderTitle: subtitle.text,
      })
    )
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
      }
    )
  }
}
