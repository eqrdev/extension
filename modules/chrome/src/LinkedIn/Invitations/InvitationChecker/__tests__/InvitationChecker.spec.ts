import { EqualizerTestHarness } from '../../../../TestUtils/EqualizerTestHarness'

describe('when we have a last checked date', () => {
  let viewModel
  let testHarness

  beforeEach(() => {
    testHarness = new EqualizerTestHarness({
      invitationsLastCheckedDate: 1689862146328,
    })
    testHarness.initInvitationChecker(data => {
      viewModel = data
    })
  })

  it('should present the appropriate format', async () => {
    expect(viewModel.lastCheck).toBe('July 20, 2023')
  })
})

describe('when we click the button', () => {
  let testHarness

  beforeEach(() => {
    testHarness = new EqualizerTestHarness()
    testHarness.initInvitationChecker(() => {})
  })

  it('should call the LinkedIn client with the proper parameters', async () => {
    await testHarness.invitationCheckerPresenter.onClickButton()

    expect(testHarness.spies.getInvitations).toHaveBeenCalledTimes(1)
    expect(testHarness.spies.clickAcceptButtons).toHaveBeenCalledWith([
      'Arnold Jedliczky',
      'Mara Albert',
      'Catherine Cooper',
    ])

    expect(testHarness.spies.getConversations).toHaveBeenCalledTimes(1)
  })
})

describe('when an invitation is not a connection', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
  })

  it('should not accept, because it is a newsletter', async () => {
    await testHarness.receiveInvitation({
      id: 7086734793308078080,
      genericInvitationType: 'CONTENT_SERIES',
      sharedSecret: 'NifOCrk1',
      message: null,
      invitationType: 'RECEIVED',
      invitationState: 'PENDING',
      senderTitle: 'Newsletter • Biweekly',
      senderName:
        'LinkedIn News Europe invited you to subscribe to Tech Wrap-Up Europe',
    })
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
  })
})

describe('when there is no openAi key', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({ openAiKey: null })
  })

  it('should accept every invitation', async () => {
    await testHarness.receiveInvitation({
      id: 7086734793308078080,
      genericInvitationType: 'CONNECTION',
      sharedSecret: 'NifOCrk1',
      message: null,
      invitationType: 'RECEIVED',
      invitationState: 'PENDING',
      senderTitle: 'Horse riding instructor at Ride Co.',
      senderName: 'Anush Vasily',
    })
    expect(testHarness.spies.clickAcceptButtons).toHaveBeenCalled()
  })
})

describe('when we have openAi key, but the invitation message is not about a job opportunity', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    testHarness.spies.isRecruiterMessage = jest.fn().mockResolvedValue(false)
    testHarness.spies.isRecruiterTitle = jest.fn().mockResolvedValue(true)
  })

  it('should accept every invitation', async () => {
    await testHarness.receiveInvitation({
      id: 7086734793308078080,
      genericInvitationType: 'CONNECTION',
      sharedSecret: 'NifOCrk1',
      message: 'Hey, do you remember me? I am Creed',
      invitationType: 'RECEIVED',
      invitationState: 'PENDING',
      senderTitle: 'HeadHunter at Dunder Mifflin, Inc.',
      senderName: 'Pam Beesley',
    })
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
  })
})

describe('when we have openAi key, no message and the senderTitle is not about a recruiter', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    testHarness.spies.isRecruiterMessage = jest.fn().mockResolvedValue(false)
    testHarness.spies.isRecruiterTitle = jest.fn().mockResolvedValue(false)
  })

  it('should accept every invitation', async () => {
    await testHarness.receiveInvitation({
      id: 7086734793308078080,
      genericInvitationType: 'CONNECTION',
      sharedSecret: 'NifOCrk1',
      message: null,
      invitationType: 'RECEIVED',
      invitationState: 'PENDING',
      senderTitle: 'Paper Sales at Dunder Mifflin, Inc.',
      senderName: 'Jim Halpert',
    })
    expect(testHarness.spies.isRecruiterMessage).toHaveBeenNthCalledWith(
      1,
      'Hello, this is a message from a recruiter. Really.'
    )
    expect(testHarness.spies.isRecruiterMessage).toHaveBeenNthCalledWith(
      2,
      'Hello, this is a message from a recruiter. Really.'
    )
    expect(testHarness.spies.isRecruiterMessage).toHaveBeenNthCalledWith(
      3,
      'Hello, this is a message from a recruiter. Really.'
    )
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
  })
})
