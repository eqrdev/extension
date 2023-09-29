export interface AIEvaluator {
  isAboutJobOpportunity(message: string): Promise<boolean>
  isInviteeRecruiter(title: string): Promise<boolean>
}
