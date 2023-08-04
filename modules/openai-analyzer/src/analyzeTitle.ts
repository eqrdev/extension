import { createTextAnalyzer, TextAnalyzer } from './createTextAnalyzer'

export const analyzeTitle: TextAnalyzer<{
  is_recruiter_title: boolean
  certainty: number
  company?: string
}> = createTextAnalyzer({
  title: 'analyze_title',
  prompt:
    'Decide whether the input is a title of a recruiter, or the company in the title can be linked to a recruiter',
  parameters: {
    type: 'object',
    properties: {
      is_recruiter_title: {
        type: 'boolean',
        description:
          'Whether the input is a job title of a recruiter or a HR person, or anyone who potentially recruits',
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
