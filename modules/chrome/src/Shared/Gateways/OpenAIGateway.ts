import { analyzeMessage, analyzeTitle, isKeyValid } from 'openai-analyzer'
import { AIEvaluator } from 'equalizer'

export class OpenAIGateway implements AIEvaluator {
  constructor(private readonly openAiKey: string) {}

  async isAboutJobOpportunity(message: string): Promise<boolean> {
    try {
      const response = await analyzeMessage(message, this.openAiKey)
      return response.is_recruiter_message
    } catch (e) {
      return false
    }
  }

  async isInviteeRecruiter(title: string): Promise<boolean> {
    try {
      const response = await analyzeTitle(title, this.openAiKey)
      return response.is_recruiter_title
    } catch (e) {
      return false
    }
  }

  async isKeyValid(apiKey: string): Promise<boolean> {
    return isKeyValid(apiKey)
  }

  hasOpenAi(): boolean {
    return Boolean(this.openAiKey)
  }
}
