import { AIEvaluator } from '../Types/AIEvaluator'
import { GeneralInvitation } from '../Types/GeneralInvitation'

export class InvitationEvaluator {
  constructor(private aiEvaluator?: AIEvaluator) {}

  async shouldAccept(invitation: GeneralInvitation): Promise<boolean> {
    if (/(months|weeks)/i.test(invitation.sentTimeLabel)) return false
    if (this.aiEvaluator === undefined) return true
    if (
      typeof invitation.message === 'string' &&
      (await this.aiEvaluator.isAboutJobOpportunity(invitation.message))
    )
      return true

    return await this.aiEvaluator.isInviteeRecruiter(invitation.inviterTitle)
  }
}
