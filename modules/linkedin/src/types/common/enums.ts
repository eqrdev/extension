const NotificationStatuses = ['ACTIVE'] as const
const Categories = ['ARCHIVE', 'INBOX', 'PRIMARY_INBOX', 'INMAIL'] as const
const States = ['ACCEPTED', 'PENDING'] as const
const RenderFormats = ['RECALLED', 'DEFAULT'] as const
const GenericInvitationTypes = ['CONNECTION', 'CONTENT_SERIES']
const InvitationTypes = ['RECEIVED'] as const
const TypeLabels = ['Connection', 'Newsletter'] as const

export type NotificationStatus = (typeof NotificationStatuses)[number]
export type Category = (typeof Categories)[number]
export type State = (typeof States)[number]
export type RenderFormat = (typeof RenderFormats)[number]
export type TypeLabel = (typeof TypeLabels)[number]
export type GenericInvitationType = (typeof GenericInvitationTypes)[number]
export type InvitationType = (typeof InvitationTypes)[number]
