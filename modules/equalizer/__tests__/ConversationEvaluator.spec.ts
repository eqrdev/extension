import { ConversationEvaluator } from '../src/Evaluators/ConversationEvaluator'
import * as mocks from './mock/mocks'

const stubDateEvaluator = {
  isInTimeRange: () => true,
  isWithinTwoWeeks: () => true,
}

describe('when the conversation is a group message', () => {
  it("shouldn't reply the message", async () => {
    const evaluator = new ConversationEvaluator(stubDateEvaluator)
    expect(await evaluator.shouldReply(mocks.groupMessage)).toBe(false)
  })
})

describe('when the ', () => {})
