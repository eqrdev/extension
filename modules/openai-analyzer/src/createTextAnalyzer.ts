import { OpenAIClient } from './client'

export type TextAnalyzer<T> = (message: string, openAiKey: string) => Promise<T>

export const createTextAnalyzer =
  <T>({
    title,
    prompt,
    parameters,
  }: {
    title: string
    prompt: string
    parameters: Record<string, unknown>
  }): TextAnalyzer<T> =>
  async (message, openAiKey) =>
    JSON.parse(
      (
        await (
          await new OpenAIClient({ apiKey: openAiKey }).post(
            'chat/completions',
            {
              body: JSON.stringify({
                model: 'gpt-3.5-turbo-0613',
                messages: [
                  {
                    role: 'user',
                    content: message,
                  },
                ],
                functions: [
                  {
                    name: title,
                    description: prompt,
                    parameters,
                  },
                ],
              }),
            }
          )
        ).json()
      ).choices[0].message.function_call.arguments
    )
