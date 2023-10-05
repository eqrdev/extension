import { ConversationEvaluator } from './ConversationEvaluator'
import { ConversationMockTestHarness } from './__mocks__/ConversationMockTestHarness'

const createDateEvaluator = (shouldReply = true) => ({
  isInTimeRange: () => shouldReply,
  isWithinTwoWeeks: () => shouldReply,
})

const createAiEvaluator = (shouldReturnTrue = true) => ({
  isAboutJobOpportunity: jest.fn(async () => shouldReturnTrue),
  isInviteeRecruiter: jest.fn(async () => true),
})

const mockBuilder = new ConversationMockTestHarness()
const aiEvaluatorReply = createAiEvaluator(true)
const aiEvaluatorNotReply = createAiEvaluator(false)
const dateEvaluatorReply = createDateEvaluator(true)
const dateEvaluatorNotReply = createDateEvaluator(false)

describe('when the conversation is a group message', () => {
  it("shouldn't reply the message", async () => {
    const evaluator = new ConversationEvaluator(dateEvaluatorReply)
    expect(
      await evaluator.shouldReply(mockBuilder.get({ isGroupMessage: true }))
    ).toBe(false)
  })
})

describe('when the conversation is not started, only one party has written yet ', () => {
  it("shouldn't reply the message", async () => {
    const evaluator = new ConversationEvaluator(dateEvaluatorReply)
    expect(
      await evaluator.shouldReply(mockBuilder.get({ isUnilateral: false }))
    ).toBe(false)
  })
})

describe('when the conversation is not in inbox (e.g. it is the archived)', () => {
  it("shouldn't reply the message", async () => {
    const evaluator = new ConversationEvaluator(dateEvaluatorReply)
    expect(
      await evaluator.shouldReply(mockBuilder.get({ isArchive: true }))
    ).toBe(false)
  })
})

describe('when we provide an AiEvaluator...', () => {
  describe('...and it decides that the message is not about a job opportunity', () => {
    it("shouldn't reply the message", async () => {
      const evaluator = new ConversationEvaluator(
        dateEvaluatorReply,
        aiEvaluatorNotReply
      )

      expect(await evaluator.shouldReply(mockBuilder.get())).toBe(false)
      expect(aiEvaluatorNotReply.isAboutJobOpportunity).toHaveBeenCalled()
    })
  })

  describe('...and it decides that the message is about a job opportunity', () => {
    it('should reply the message', async () => {
      const evaluator = new ConversationEvaluator(
        dateEvaluatorReply,
        aiEvaluatorReply
      )
      expect(await evaluator.shouldReply(mockBuilder.get())).toBe(true)
      expect(aiEvaluatorReply.isAboutJobOpportunity).toHaveBeenCalled()
    })
  })
})

describe('when it is out of the two week time range', () => {
  it("shouldn't reply the message", async () => {
    const evaluator = new ConversationEvaluator(
      dateEvaluatorNotReply,
      aiEvaluatorReply
    )

    expect(await evaluator.shouldReply(mockBuilder.get())).toBe(false)
  })
})
