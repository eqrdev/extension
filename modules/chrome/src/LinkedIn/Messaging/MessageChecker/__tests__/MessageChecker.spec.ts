import { EqualizerTestHarness } from '../../../../TestUtils/EqualizerTestHarness'

describe('When profile url is not provided by the user', () => {
  let testHarness = null
  let viewModel = null

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({ profileName: null })
    await testHarness.initMessageChecker(data => {
      viewModel = data
    })
  })

  it("shouldn't show the Message checker button", async () => {
    expect(viewModel.shouldShowCheckerButton).toBe(false)
  })
})

describe('When we click the button', () => {
  let testHarness = null
  let viewModel = null

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    await testHarness.initMessageChecker(data => {
      viewModel = data
    })
  })

  it('should show the message checker', async () => {
    expect(viewModel.shouldShowCheckerButton).toBe(true)
  })

  it('should call the linkedin api with the correct values', async () => {
    await testHarness.messageCheckerPresenter.onClickMessages()
    expect(testHarness.spies.getConversations).toHaveBeenCalledTimes(1)

    expect(testHarness.spies.getConversation).toHaveBeenNthCalledWith(
      1,
      'ARqe0o0OYH2XvCCzQdnB043AbQKCAU6BLYGsknt'
    )
    expect(testHarness.spies.getConversation).toHaveBeenNthCalledWith(
      2,
      'UY0AHsqKvOAQCCkB6Gtd0nbY0CBQX4z3ALeRo2n'
    )
    expect(testHarness.spies.getConversation).toHaveBeenNthCalledWith(
      3,
      'soCL20G6BeOdqbYQBnU0AAnAYHCz0vKk4XQRC3t'
    )

    expect(testHarness.spies.isRecruiterMessage).toHaveBeenCalledWith(
      'Hello, this is a message from a recruiter. Really.'
    )

    expect(testHarness.spies.isRecruiterMessage).toHaveBeenCalledTimes(3)

    expect(testHarness.spies.sendMessage).toHaveBeenNthCalledWith(
      1,
      'ARqe0o0OYH2XvCCzQdnB043AbQKCAU6BLYGsknt',
      'My message'
    )

    expect(testHarness.spies.sendMessage).toHaveBeenNthCalledWith(
      2,
      'UY0AHsqKvOAQCCkB6Gtd0nbY0CBQX4z3ALeRo2n',
      'My message'
    )

    expect(testHarness.spies.sendMessage).toHaveBeenNthCalledWith(
      3,
      'soCL20G6BeOdqbYQBnU0AAnAYHCz0vKk4XQRC3t',
      'My message'
    )

    expect(testHarness.spies.setSyncedData).toHaveBeenCalledWith(
      'messagesLastCheckedDate',
      new Date('2023-10-10:10:10').getTime()
    )
  })
})

describe('when no openai key provided', () => {
  let testHarness = null

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({ openAiKey: null })
    testHarness.spies.hasOpenAi = jest.fn().mockReturnValue(false)
    await testHarness.initMessageChecker(() => {})
  })

  it("shouldn't call the openai api", async () => {
    await testHarness.messageCheckerPresenter.onClickMessages()
    expect(testHarness.spies.isRecruiterMessage).not.toHaveBeenCalled()
  })
})
