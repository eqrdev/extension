import { analyzeMessage, analyzeTitle, isKeyValid } from 'openai-analyzer'

export class OpenAIGateway {
  private readonly openAiKey: string

  constructor(openAiKey: string) {
    this.openAiKey = openAiKey
  }

  async isRecruiterMessage(message: string): Promise<boolean> {
    const response = await analyzeMessage(message, this.openAiKey)
    return response.is_recruiter_message
  }

  async isRecruiterTitle(title: string): Promise<boolean> {
    const response = await analyzeTitle(title, this.openAiKey)
    return response.is_recruiter_title
  }

  async isKeyValid(apiKey: string): Promise<boolean> {
    return isKeyValid(apiKey)
  }

  hasOpenAi(): boolean {
    return Boolean(this.openAiKey)
  }
}
