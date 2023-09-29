import { analyzeMessage, analyzeTitle } from 'openai-analyzer'
import { AIEvaluator } from '../Types/AIEvaluator'

export class OpenAIEvaluator implements AIEvaluator {
  constructor(private apiKey: string) {}

  async isAboutJobOpportunity(message: string): Promise<boolean> {
    return (await analyzeMessage(message, this.apiKey)).is_recruiter_message
  }
  async isInviteeRecruiter(title: string): Promise<boolean> {
    return (await analyzeTitle(title, this.apiKey)).is_recruiter_title
  }
}
