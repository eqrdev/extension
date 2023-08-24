import { Nullable } from './common/utilities'
import { GenericInvitationType, InvitationType, State } from './common/enums'

export type Invitation = {
  id: number
  sharedSecret: string
  message: Nullable<string>
  genericInvitationType: GenericInvitationType
  invitationType: InvitationType
  invitationState: State
  senderName: string
  senderTitle: string
}
