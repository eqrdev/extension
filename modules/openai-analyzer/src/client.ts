export class OpenAIClient {
  private static ApiRoot = 'https://api.openai.com/v1/'

  private readonly apiKey: string

  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey
  }

  async request(url: string, options?: RequestInit) {
    return fetch(`${OpenAIClient.ApiRoot}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      ...options,
    })
  }

  async get(url: string, options?: RequestInit) {
    return this.request(url, {
      method: 'get',
      ...options,
    })
  }

  async post(url: string, options?: RequestInit) {
    return this.request(url, {
      method: 'post',
      ...options,
    })
  }
}
