import { EqualizerTestHarness } from '../../../TestUtils/EqualizerTestHarness'
import { conversationsStub } from './__stubs__/stubs'

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

describe('When `messagesLastCheckedDate` not provided', () => {
  let testHarness = null
  let viewModel = null

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({
      messagesLastCheckedDate: undefined,
    })
    testHarness.spies.getConversations = jest.fn().mockResolvedValue([
      {
        categories: ['PRIMARY_INBOX', 'INMAIL'],
        conversationParticipantsCount: 2,
        lastActivityAt: new Date('2023-10-10').getTime(),
        createdAt: new Date('2023-10-10').getTime(),
        entityUrn: 'urn:li:fsd_profile:ARqe0o0OYH2XvCCzQdnB043AbQKCAU6BLYGsknt',
      },
    ])
    await testHarness.initMessageChecker(data => {
      viewModel = data
    })
  })

  it('should not display the last checked date', async () => {
    expect(viewModel.hasLastCheckedDate).toBe(false)
  })
})

describe('When `messagesLastCheckedDate` provided', () => {
  let testHarness = null
  let viewModel = null

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({
      messagesLastCheckedDate: new Date('2023-10-10').getTime(),
    })
    testHarness.spies.getConversations = jest.fn().mockResolvedValue([
      {
        categories: ['PRIMARY_INBOX', 'INMAIL'],
        conversationParticipantsCount: 2,
        lastActivityAt: new Date('2023-10-11').getTime(),
        createdAt: new Date('2023-10-10').getTime(),
        entityUrn: 'urn:li:fsd_profile:ARqe0o0OYH2XvCCzQdnB043AbQKCAU6BLYGsknt',
      },
    ])
    await testHarness.initMessageChecker(data => {
      viewModel = data
    })
  })

  it('should show the last checked date', async () => {
    expect(viewModel.hasLastCheckedDate).toBe(true)
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
    expect(testHarness.spies.isAboutJobOpportunity).toHaveBeenCalledWith(
      'world\nHello'
    )

    expect(testHarness.spies.replyConversation).toHaveBeenCalledTimes(3)

    expect(testHarness.spies.replyConversation).toHaveBeenNthCalledWith(
      1,
      conversationsStub[0],
      'My message: https://equalizer.dev/me/my-profile-name'
    )

    expect(testHarness.spies.replyConversation).toHaveBeenNthCalledWith(
      2,
      conversationsStub[1],
      'My message: https://equalizer.dev/me/my-profile-name'
    )

    expect(testHarness.spies.replyConversation).toHaveBeenNthCalledWith(
      3,
      conversationsStub[2],
      'My message: https://equalizer.dev/me/my-profile-name'
    )

    expect(testHarness.spies.setSyncedData).toHaveBeenCalledWith(
      'messagesLastCheckedDate',
      new Date('2023-10-10:10:10').getTime()
    )

    expect(testHarness.spies.domDispatch).toHaveBeenCalledWith(
      'checked:messages',
      { count: 3 }
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
    expect(testHarness.spies.isAboutJobOpportunity).not.toHaveBeenCalled()
  })
})
