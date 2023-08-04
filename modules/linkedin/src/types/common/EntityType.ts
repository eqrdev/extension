export const NS = 'com.linkedin.'
export const Voyager = `${NS}voyager.dash.`

export const VoyagerEntityType = {
  ImageAttribute: `${Voyager}common.image.ImageAttribute`,
  ImageViewModel: `${Voyager}common.image.ImageViewModel`,
  TextAttribute: `${Voyager}common.text.TextAttribute`,
  TextViewModel: `${Voyager}common.text.TextViewModel`,
  TextLink: `${Voyager}common.text.TextLink`,

  InvitationView: `${Voyager}relationships.invitation.InvitationView`,
  Invitation: `${Voyager}relationships.invitation.Invitation`,

  Company: `${Voyager}organization.Company`,

  Profile: `${Voyager}identity.profile.Profile`,
  PhotoFilterPicture: `${Voyager}identity.profile.PhotoFilterPicture`,
} as const

export const GraphQLEntityType = {
  AttributedText: `${NS}pemberly.text.AttributedText`,

  Image: `${NS}common.VectorImage`,
  VectorArtifact: `${NS}common.VectorArtifact`,
  VectorImage: `${NS}common.VectorImage`,
  CollectionMetadata: `${NS}common.CollectionMetadata`,
  CollectionResponse: `${NS}common.CollectionResponse`,
  MemberParticipantInfo: `${NS}messenger.MemberParticipantInfo`,
  MessagingParticipant: `${NS}messenger.MessagingParticipant`,
  InlineWarning: `${NS}messenger.InlineWarning`,
  Message: `${NS}messenger.Message`,
  Conversation: `${NS}messenger.Conversation`,
  ConversationDisabledFeature: `${NS}messenger.ConversationDisabledFeature`,
} as const

export const EntityType = {
  ...VoyagerEntityType,
  ...GraphQLEntityType,
} as const

export type Entity = (typeof EntityType)[keyof typeof EntityType]
