import { GeneralInvitation } from './GeneralInvitation'
import { GeneralConversation } from './GeneralConversation'

export interface LinkedInService {
  getInvitations(): Promise<GeneralInvitation[]>
  getConversations(): Promise<GeneralConversation[]>
  acceptInvitation(invitations: GeneralInvitation): Promise<void>
  replyConversation(
    conversations: GeneralConversation,
    message: string
  ): Promise<void>
}
