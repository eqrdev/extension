import { AIEvaluator } from '../Types/AIEvaluator'
import { DateEvaluatorInterface } from '../Types/DateEvaluatorInterface'
import { GeneralConversation } from '../Types/GeneralConversation'

export class ConversationEvaluator {
  constructor(
    private dateEvaluator: DateEvaluatorInterface,
    private aiEvaluator?: AIEvaluator
  ) {}

  private getConversationText(conversation: GeneralConversation): string {
    return conversation.messages
      .map(({ text }) => text)
      .reverse()
      .join('\n')
  }

  private getEngagedParticipantsCount(
    conversation: GeneralConversation
  ): number {
    return new Set(conversation.messages.map(({ sender }) => sender)).size
  }

  private isInInbox(conversation: GeneralConversation): boolean {
    return (
      conversation.categories.includes('PRIMARY_INBOX') ||
      conversation.categories.includes('INMAIL')
    )
  }

  private isGroupMessage(conversation: GeneralConversation): boolean {
    return conversation.participants.length !== 2
  }

  private isInTimeRange(conversation: GeneralConversation): boolean {
    return this.dateEvaluator.isWithinTwoWeeks(conversation.createdAt)
  }

  private isUnilateralContact(conversation: GeneralConversation): boolean {
    return this.getEngagedParticipantsCount(conversation) === 1
  }

  private async isAboutJobOpportunity(
    conversation: GeneralConversation
  ): Promise<boolean> {
    if (!this.aiEvaluator) {
      return true
    }

    return await this.aiEvaluator.isAboutJobOpportunity(
      this.getConversationText(conversation)
    )
  }

  async shouldReply(conversation: GeneralConversation): Promise<boolean> {
    return (
      !this.isGroupMessage(conversation) &&
      this.isInInbox(conversation) &&
      this.isInTimeRange(conversation) &&
      this.isUnilateralContact(conversation) &&
      (await this.isAboutJobOpportunity(conversation))
    )
  }
}
