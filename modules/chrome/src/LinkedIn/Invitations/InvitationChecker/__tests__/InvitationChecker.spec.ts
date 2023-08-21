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
    expect(testHarness.spies.acceptInvitation).toHaveBeenNthCalledWith(
      1,
      '9789428921',
      'NrtQx6ioﬀ'
    )
    expect(testHarness.spies.acceptInvitation).toHaveBeenNthCalledWith(
      2,
      '4892374874',
      'wlApmssu'
    )
    expect(testHarness.spies.acceptInvitation).toHaveBeenNthCalledWith(
      3,
      '9867875488',
      'NifOCrk1'
    )
    expect(testHarness.spies.setSessionData).toHaveBeenCalledWith(
      'invitationsAcceptedCount',
      3
    )
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
    })
    expect(testHarness.spies.acceptInvitation).toHaveBeenCalled()
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
    })
    expect(testHarness.spies.isRecruiterMessage).not.toHaveBeenCalled()
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
  })
})
