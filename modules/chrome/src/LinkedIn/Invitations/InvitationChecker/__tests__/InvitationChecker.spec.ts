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
  let viewModel
  let testHarness

  beforeEach(() => {
    testHarness = new EqualizerTestHarness()
    testHarness.initInvitationChecker(data => {
      viewModel = data
    })
  })

  it('should call the LinkedIn client with the proper parameters', async () => {
    await testHarness.invitationCheckerPresenter.onClickButton()

    expect(testHarness.spies.getInvitations).toHaveBeenCalledTimes(1)
    expect(testHarness.spies.clickAcceptButtons).toHaveBeenCalledWith([
      'Arnold Jedliczky',
      'Mara Albert',
      'Catherine Cooper',
    ])

    expect(viewModel.invitationsAcceptedCount).toBe(3)
    expect(testHarness.spies.getConversations).toHaveBeenCalledTimes(1)
  })
})

describe('when an invitation is not a connection', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    await testHarness.receiveInvitation(
      {
        id: 7086734793308078080,
        genericInvitationType: 'CONTENT_SERIES',
        sharedSecret: 'NifOCrk1',
        message: null,
        invitationType: 'RECEIVED',
        invitationState: 'PENDING',
        senderTitle: 'Newsletter • Biweekly',
        senderName:
          'LinkedIn News Europe invited you to subscribe to Tech Wrap-Up Europe',
      },
      () => {}
    )
  })

  it('should not accept, because it is a newsletter', async () => {
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
  })
})

describe('when there is no openAi key', () => {
  let viewModel
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()

    await testHarness.receiveInvitation(
      {
        id: 7086734793308078080,
        genericInvitationType: 'CONNECTION',
        sharedSecret: 'NifOCrk1',
        message: null,
        invitationType: 'RECEIVED',
        invitationState: 'PENDING',
        senderTitle: 'Horse riding instructor at Ride Co.',
        senderName: 'Anush Vasily',
      },
      data => {
        viewModel = data
      }
    )
  })

  it('should accept every invitation', async () => {
    expect(testHarness.spies.clickAcceptButtons).toHaveBeenCalledWith([
      'Anush Vasily',
    ])
    expect(viewModel.invitationsAcceptedCount).toBe(1)
  })
})

describe('when we have openAi key, but the invitation message is not about a job opportunity', () => {
  let viewModel
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    testHarness.spies.isRecruiterMessage = jest.fn().mockResolvedValue(false)
    testHarness.spies.isRecruiterTitle = jest.fn().mockResolvedValue(true)
    await testHarness.receiveInvitation(
      {
        id: 7086734793308078080,
        genericInvitationType: 'CONNECTION',
        sharedSecret: 'NifOCrk1',
        message: 'Hey, do you remember me? I am Creed',
        invitationType: 'RECEIVED',
        invitationState: 'PENDING',
        senderTitle: 'HeadHunter at Dunder Mifflin, Inc.',
        senderName: 'Pam Beesley',
      },
      data => {
        viewModel = data
      }
    )
  })

  it('should not accept the invitation', async () => {
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
    expect(viewModel.invitationsAcceptedCount).toBe(0)
  })
})

describe('when we have openAi key, no message and the senderTitle is not about a recruiter', () => {
  let testHarness
  let viewModel
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    testHarness.spies.isRecruiterMessage = jest.fn().mockResolvedValue(false)
    testHarness.spies.isRecruiterTitle = jest.fn().mockResolvedValue(false)
    testHarness.spies.getConversations = jest.fn().mockResolvedValue([])
    await testHarness.receiveInvitation(
      {
        id: 7086734793308078080,
        genericInvitationType: 'CONNECTION',
        sharedSecret: 'NifOCrk1',
        message: null,
        invitationType: 'RECEIVED',
        invitationState: 'PENDING',
        senderTitle: 'Paper Sales at Dunder Mifflin, Inc.',
        senderName: 'Jim Halpert',
      },
      data => {
        viewModel = data
      }
    )
  })

  it('should accept no invitation', async () => {
    expect(testHarness.spies.isRecruiterMessage).not.toHaveBeenCalled()
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
    expect(viewModel.invitationsAcceptedCount).toBe(0)
  })
})
