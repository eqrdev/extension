import {
  ConversationEvaluator,
  EnquiryMonitor,
  GeneralConversation,
} from 'equalizer'
import { LinkedInAPIGateway } from '../Shared/Gateways/LinkedInAPIGateway'

export class ConversationMonitor extends EnquiryMonitor<GeneralConversation> {
  constructor(
    private linkedin: LinkedInAPIGateway,
    private evaluator: ConversationEvaluator,
    private lastMonitoringDate?: number,
    private message?: string
  ) {
    super()
  }

  protected async getEnquiries(): Promise<GeneralConversation[]> {
    return this.linkedin.getConversations()
  }

  protected async isAlreadyChecked({
    lastActivityAt,
  }: GeneralConversation): Promise<boolean> {
    const hasLastCheckedDate = typeof this.lastMonitoringDate === 'number'

    if (hasLastCheckedDate) {
      return lastActivityAt < this.lastMonitoringDate
    }

    return true
  }

  protected async respondEnquiry(
    conversation: GeneralConversation
  ): Promise<void> {
    return this.linkedin.replyConversation(conversation, this.message)
  }

  protected async shouldResponseEnquiry(
    conversation: GeneralConversation
  ): Promise<boolean> {
    return this.evaluator.shouldReply(conversation)
  }
}
