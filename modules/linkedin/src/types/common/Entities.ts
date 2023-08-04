import { CollectionOf, Nullable, Typed } from './utilities'
import {
  Category,
  GenericInvitationType,
  InvitationType,
  NotificationStatus,
  RenderFormat,
  State,
  TypeLabel,
} from './enums'

export type AttributedText = Typed<{
  text: string
  attributes: []
}>

export type VectorArtifact = Typed<{
  width: number
  height: number
  fileIdentifyingUrlPathSegment: string
  expiresAt?: number
}>

export type Image = Typed<{
  digitalmediaAsset: Nullable<unknown>
  attribution: Nullable<unknown>
  focalPoint: Nullable<unknown>
  rootUrl: string
  artifacts: Array<VectorArtifact>
}>

export type MemberParticipantInfo = Typed<{
  profileUrl: string
  firstName: AttributedText
  lastName: AttributedText
  profilePicture: Image
  distance: string
  pronoun: Nullable<unknown>
  headline: AttributedText
}>

export type MessagingParticipant = Typed<{
  hostIdentityUrn: string
  entityUrn: string
  participantType?: {
    member: MemberParticipantInfo
    organization: Nullable<unknown>
    custom: Nullable<unknown>
  }
}>

export type InlineWarning = Typed<{
  inlineWarningPrompt: AttributedText
  obfuscatedMessageWarning: AttributedText
}>

export type Message = Typed<{
  reactionSummaries: Array<unknown>
  footer: Nullable<unknown>
  subject: Nullable<string>
  inlineWarning: Nullable<InlineWarning>
  body: AttributedText
  originToken: string
  backendUrn: string
  deliveredAt: number
  renderContentFallbackText: Nullable<unknown>
  entityUrn: string
  sender: MessagingParticipant
  backendConversationUrn: string
  incompleteRetriableData: boolean
  messageBodyRenderFormat: RenderFormat
  renderContent: Array<unknown>
  conversation: {
    entityUrn: string
  }
}>

export type ConversationDisabledFeature = Typed<{
  disabledFeature: string
  reasonText: Nullable<AttributedText>
}>

export type Conversation = Typed<{
  notificationStatus: NotificationStatus
  conversationParticipants: MessagingParticipant[]
  unreadCount: number
  lastActivityAt: number
  title: Nullable<unknown>
  backendUrn: string
  shortHeadlineText: Nullable<unknown>
  createdAt: number
  lastReadAt: number
  hostConversationActions: Array<unknown>
  entityUrn: string
  categories: Array<Category>
  state: State
  disabledFeatures: Array<ConversationDisabledFeature>
  creator: MessagingParticipant
  read: boolean
  groupChat: boolean
  contentMetadata: Nullable<unknown>
  conversationUrl: string
  headlineText: Nullable<unknown>
  incompleteRetriableData: boolean
  conversationTypeText: Nullable<AttributedText>
  messages: CollectionOf<Message>
}>

export type VectorImage = Typed<{
  digitalmediaAsset: string
  attribution: Nullable<unknown>
  artifacts: Array<VectorArtifact>
  rootUrl: string
}>

export type CollectionMetadata = Typed<{
  start: number
  count: number
  total: number
}>

type ImageAttribute = Typed<{
  scalingType: Nullable<unknown>
  detailData: {
    profilePictureWithoutFrame: Nullable<unknown>
    profilePictureWithRingStatus: Nullable<unknown>
    companyLogo: Nullable<unknown>
    icon: Nullable<unknown>
    systemImage: Nullable<unknown>
    nonEntityGroupLogo: Nullable<unknown>
    vectorImage: Nullable<unknown>
    nonEntityProfessionalEventLogo: Nullable<unknown>
    imageUrl: Nullable<unknown>
    professionalEventLogo: Nullable<unknown>
    nonEntityCompanyLogo: Nullable<unknown>
    nonEntitySchoolLogo: Nullable<unknown>
    '*profilePicture': string
    groupLogo: Nullable<unknown>
    schoolLogo: Nullable<unknown>
    ghostImage: Nullable<unknown>
    nonEntityProfilePicture: Nullable<unknown>
  }
  tintColor: Nullable<unknown>
  tapTargets: Array<unknown>
  displayAspectRatio: Nullable<unknown>
}>

type ImageViewModel = Typed<{
  attributes: Array<ImageAttribute>
  editableAccessibilityText: boolean
  actionTarget: string
  accessibilityTextAttributes: Array<unknown>
  totalCount: Nullable<unknown>
  accessibilityText: string
}>

type TextLink = Typed<{
  viewingBehavior: string
  sponsoredUrlAttributes: Nullable<unknown>
  url: string
}>

type TextAttribute = Typed<{
  start: number
  length: number
  detailData: {
    jobPostingName: Nullable<unknown>
    hyperlink: Nullable<unknown>
    profileFamiliarName: Nullable<unknown>
    color: Nullable<unknown>
    companyName: Nullable<unknown>
    icon: Nullable<unknown>
    epoch: Nullable<unknown>
    systemImage: Nullable<unknown>
    textLink: Nullable<TextLink>
    listItemStyle: Nullable<unknown>
    groupName: Nullable<unknown>
    hyperlinkOpenExternally: Nullable<unknown>
    listStyle: Nullable<unknown>
    profileFullName: Nullable<unknown>
    stringFieldReference: Nullable<unknown>
    learningCourseName: Nullable<unknown>
    profileMention: Nullable<unknown>
    style: string
    schoolName: Nullable<unknown>
    hashtag: Nullable<unknown>
  }
}>

export type TextViewModel = Typed<{
  textDirection: string
  text: string
  attributesV2: Array<TextAttribute>
  accessibilityTextAttributesV2: Array<unknown>
  accessibilityText: Nullable<unknown>
}>

export type Invitation = Typed<{
  inviteeMemberResolutionResult: Nullable<unknown>
  inviterFollowingInvitee: boolean
  genericInvitationType: GenericInvitationType
  invitationState: State
  invitationId: number
  message: Nullable<string>
  genericInviter: {
    memberProfileUrn: null
    contentSeries: Nullable<
      Typed<{
        title: string
        entityUrn: string
      }>
    >
    marketplaceProviderUrn: null
    eventUrn: null
    organizationUrn: null
    group: null
  }
  preAcceptExtensionUseCase: Nullable<unknown>
  invitationType: InvitationType
  entityUrn: string
  sharedSecret: string
  unseen: Nullable<unknown>
  trackingId: Nullable<unknown>
}>

export type InvitationView = Typed<{
  insight: Nullable<unknown>
  sentTimeLabel: string
  primaryImage: ImageViewModel
  invitation: Invitation
  subtitle: TextViewModel
  typeLabel: TypeLabel
  showAcceptFriction: boolean
  title: TextViewModel
}>
