import { Nullable, VoyagerTyped } from './utilities'
import {
  GenericInvitationType,
  InvitationType,
  State,
  TypeLabel,
} from './enums'

export type CollectionMetadata = VoyagerTyped<{
  start: number
  count: number
  total: number
}>

export type ImageAttribute = VoyagerTyped<{
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

type TextLink = VoyagerTyped<{
  viewingBehavior: string
  sponsoredUrlAttributes: Nullable<unknown>
  url: string
}>

type TextAttribute = VoyagerTyped<{
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

export type TextViewModel = VoyagerTyped<{
  textDirection: string
  text: string
  attributesV2: Array<TextAttribute>
  accessibilityTextAttributesV2: Array<unknown>
  accessibilityText: Nullable<unknown>
}>

export type ImageViewModel = VoyagerTyped<{
  attributes: Array<ImageAttribute>
  editableAccessibilityText: boolean
  actionTarget: string
  accessibilityTextAttributes: Array<unknown>
  totalCount: Nullable<unknown>
  accessibilityText: string
}>

export type InvitationView = VoyagerTyped<{
  insight: Nullable<unknown>
  sentTimeLabel: string
  primaryImage: ImageViewModel
  subtitle: TextViewModel
  '*invitation': string
  typeLabel: TypeLabel
  showAcceptFriction: boolean
  title: TextViewModel
}>

export type MicroSchema = {
  isGraphQL: boolean
  version: string
  types: Record<string, unknown>
}

export type ContentSeriesInclude = VoyagerTyped<{
  title: string
  entityUrn: string
}>

type PhotoFilterPicture = VoyagerTyped<{
  displayImageReferenceResolutionResult: Nullable<unknown>
  displayImageWithFrameReference: Nullable<unknown>
  displayImageUrn: Nullable<unknown>
}>

export type ProfileInclude = VoyagerTyped<{
  profilePicture: PhotoFilterPicture
  firstName: string
  lastName: string
  objectUrn: string
  entityUrn: string
  publicIdentifier: string
}>

export type InvitationInclude = VoyagerTyped<{
  inviterFollowingInvitee: boolean
  '*inviteeMemberResolutionResult': string
  genericInvitationType: GenericInvitationType
  invitationState: State
  invitationId: number
  message: Nullable<string>
  genericInviter: {
    contentSeries: Nullable<unknown>
    marketplaceProviderUrn: Nullable<unknown>
    eventUrn: Nullable<unknown>
    '*memberProfileUrn': string
    organizationUrn: Nullable<unknown>
    group: Nullable<unknown>
  }
  preAcceptExtensionUseCase: Nullable<unknown>
  invitationType: InvitationType
  entityUrn: string
  sharedSecret: string
  unseen: boolean
  trackingId: Nullable<unknown>
}>

type VectorArtifact = VoyagerTyped<{
  width: number
  fileIdentifyingUrlPathSegment: string
  expiresAt: number
  height: number
}>

type VectorImage = VoyagerTyped<{
  digitalmediaAsset: string
  attribution: Nullable<unknown>
  artifacts: Array<VectorArtifact>
  rootUrl: string
}>

export type CompanyInclude = VoyagerTyped<{
  entityUrn: string
  logoResolutionResult: {
    url: Nullable<string>
    vectorImage: VectorImage
  }
}>
