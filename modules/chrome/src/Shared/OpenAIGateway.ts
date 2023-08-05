import { analyzeMessage, analyzeTitle } from 'openai-analyzer'

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

  get hasOpenAi(): boolean {
    return Boolean(this.openAiKey)
  }
}
