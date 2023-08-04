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
          await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${openAiKey}`,
            },
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
          })
        ).json()
      ).choices[0].message.function_call.arguments
    )
