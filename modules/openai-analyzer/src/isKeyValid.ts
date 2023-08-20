import { OpenAIClient } from './client'

export const isKeyValid = async (apiKey: string): Promise<boolean> =>
  (await new OpenAIClient({ apiKey }).get('usage')).status === 200
