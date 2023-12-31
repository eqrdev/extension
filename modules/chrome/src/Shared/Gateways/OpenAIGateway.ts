import { analyzeMessage, analyzeTitle, isKeyValid } from 'openai-analyzer'

export class OpenAIGateway {
  private readonly openAiKey: string

  constructor(openAiKey: string) {
    this.openAiKey = openAiKey
  }

  async isRecruiterMessage(message: string): Promise<boolean> {
    try {
      const response = await analyzeMessage(message, this.openAiKey)
      return response.is_recruiter_message
    } catch (e) {
      return false
    }
  }

  async isRecruiterTitle(title: string): Promise<boolean> {
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
