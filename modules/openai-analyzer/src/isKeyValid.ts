import { OpenAIClient } from './client'

export const isKeyValid = async (apiKey: string): Promise<boolean> => {
  const apiKeyRegex = /^sk-[A-Za-z0-9]{29}$/

  if (!apiKeyRegex.test(apiKey)) {
    return false
  }

  return (await new OpenAIClient({ apiKey }).get('models')).status === 200
}
