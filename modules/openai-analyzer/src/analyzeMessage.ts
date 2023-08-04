import { createTextAnalyzer, TextAnalyzer } from './createTextAnalyzer'

export const analyzeMessage: TextAnalyzer<{
  is_recruiter_message: boolean
  certainty: number
  company?: string
}> = createTextAnalyzer({
  title: 'message_interpretation',
  prompt:
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
})
