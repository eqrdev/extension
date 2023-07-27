import { Category, NotificationStatus, RenderFormat, State } from './enums'

export interface EntityType<T extends string = string> {
  _type: `com.linkedin.${T}`
}

export type RecipeType = {
  _recipeType: `com.linkedin.${string}`
}

export type Urn<T extends string> = `urn:li:${T}`

type With<T = string, U extends Record> = RecipeType & EntityType<T> & U

type Nullable<T> = null | T
type Maybe<T> = undefined | T

export type Collection<
  T extends string,
  U extends Record,
  V extends Record = Record<string, never>,
> = With<
  T,
  {
    elements: Array<U>
  } & V
>

export type AttributedText = With<
  'pemberly.text.AttributedText',
  {
    text: string
    attributes: []
  }
>

export type Artifact = With<
  'common.VectorArtifact',
  {
    width: number
    height: number
    fileIdentifyingUrlPathSegment: string
  }
>

export type Image = With<
  'common.VectorImage',
  {
    digitalmediaAsset: Nullable<unknown>
    attribution: Nullable<unknown>
    focalPoint: Nullable<unknown>
    rootUrl: string
    artifacts: Array<Artifact>
  }
>

export type LinkedInMember = With<
  'messenger.MemberParticipantInfo',
  {
    profileUrl: string
    firstName: AttributedText
    lastName: AttributedText
    profilePicture: Image
    distance: string
    pronoun: Nullable<unknown>
    headline: AttributedText
  }
>

export type ConversationParticipant = With<
  'messenger.MessagingParticipant',
  {
    hostIdentityUrn: Urn<string>
    entityUrn: Urn<string>
    participantType: Maybe<{
      member: LinkedInMember
      organization: Nullable<unknown>
      custom: Nullable<unknown>
    }>
  }
>

export type InlineWarning = With<
  'messenger.InlineWarning',
  {
    inlineWarningPrompt: AttributedText
    obfuscatedMessageWarning: AttributedText
  }
>

type ConversationLink = With<
  'messenger.Conversation',
  {
    entityUrn: Urn<string>
  }
>

export type Message = With<
  'messenger.Message',
  {
    reactionSummaries: Array<unknown>
    footer: Nullable<unknown>
    subject: Nullable<string>
    inlineWarning: Nullable<InlineWarning>
    body: AttributedText
    originToken: string
    backendUrn: Urn<string>
    deliveredAt: number
    renderContentFallbackText: Nullable<unknown>
    entityUrn: Urn<string>
    sender: ConversationParticipant
    backendConversationUrn: Urn<string>
    incompleteRetriableData: boolean
    messageBodyRenderFormat: RenderFormat
    renderContent: Array<unknown>
    conversation: ConversationLink
  }
>

export type ConversationDisabledFeature = With<
  'messenger.ConversationDisabledFeature',
  {
    disabledFeature: string
    reasonText: Nullable<AttributedText>
  }
>

export type MessengerConversation = With<
  'messenger.Conversation',
  {
    notificationStatus: NotificationStatus
    conversationParticipants: Array<ConversationParticipant>
    unreadCount: number
    lastActivityAt: number
    title: Nullable<unknown>
    backendUrn: Urn<string>
    shortHeadlineText: Nullable<unknown>
    createdAt: number
    lastReadAt: number
    hostConversationActions: Array<unknown>
    entityUrn: Urn<string>
    categories: Array<Category>
    state: State
    disabledFeatures: Array<ConversationDisabledFeature>
    creator: ConversationParticipant
    read: boolean
    groupChat: boolean
    contentMetadata: Nullable<unknown>
    conversationUrl: string
    headlineText: Nullable<unknown>
    incompleteRetriableData: boolean
    conversationTypeText: Nullable<AttributedText>
    messages: Collection<'common.CollectionResponse', Message>
  }
>
