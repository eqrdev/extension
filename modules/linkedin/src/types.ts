export interface MessengerConversation {
  notificationStatus: string
  conversationParticipants: Array<MessagingParticipant>
  unreadCount: number
  lastActivityAt: number
  title: string
  backendUrn: string
  shortHeadlineText: string
  createdAt: number
  lastReadAt: number
  hostConversationActions: Array<any>
  entityUrn: string
  categories: Array<string>
  state: string
  disabledFeatures: Array<ConversationDisabledFeature>
  creator: MessagingParticipant
  read: boolean
  groupChat: boolean
  contentMetadata: any
  conversationUrl: string
  headlineText: string
  incompleteRetriableData: boolean
  messages: Array<Message>
  conversationTypeText: string
}

interface MessagingParticipant {
  hostIdentityUrn: string
  entityUrn: string
  _type: string
  participantType: ParticipantType
}

interface ParticipantType {
  member: MemberParticipantInfo
}

interface MemberParticipantInfo {
  profileUrl: string
  firstName: AttributedText
  lastName: AttributedText
  profilePicture: VectorImage
  distance: string
  pronoun: string
  _type: string
  headline: AttributedText
}

interface AttributedText {
  text: string
  attributes: Array<any>
}

interface VectorImage {
  digitalmediaAsset: any
  _type: string
  attribution: any
  _recipeType: string
  focalPoint: any
  artifacts: Array<Artifact>
}

interface Artifact {
  width: number
  _type: string
  _recipeType: string
  fileIdentifyingUrlPathSegment: string
  height: number
}

interface ConversationDisabledFeature {
  disabledFeature: string
  reasonText: string
  _type: string
  _recipeType: string
}

export interface Message {
  reactionSummaries: Array<any>
  footer: any
  subject: string
  _type: string
  inlineWarning: any
  body: AttributedText
  originToken: string
  _recipeType: string
  backendUrn: string
  deliveredAt: number
  renderContentFallbackText: string
  entityUrn: string
  sender: MessagingParticipant
  backendConversationUrn: string
  incompleteRetriableData: boolean
  messageBodyRenderFormat: string
  renderContent: Array<any>
  conversation: MessengerConversation
}
