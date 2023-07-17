interface Response {
  is_recruiter_message: boolean
  certainty: number
  company?: string
}

export const analyzeMessage = async (
  message: string,
  openAiKey: string
): Promise<Response> =>
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
                name: 'message_interpretation',
                description:
                  'Decide whether the input is a request from a recruiter, and is a message about a possible job opportunity',
                parameters: {
                  type: 'object',
                  properties: {
                    is_recruiter_message: {
                      type: 'boolean',
                      description: 'Whether the input is a request',
                    },
                    certainty: {
                      type: 'number',
                      description: 'How certain you are as a percentage',
                    },
                    company: {
                      type: 'string',
                      description: "Extract the company name if it's provided",
                    },
                  },
                  required: ['is_recruiter_message', 'certainty'],
                },
              },
            ],
          }),
        })
      ).json()
    ).choices[0].message.function_call.arguments
  )
