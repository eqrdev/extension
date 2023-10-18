import { EqualizerTestHarness } from '../../../TestUtils/EqualizerTestHarness'

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

    expect(testHarness.spies.domDispatch).toHaveBeenCalledWith(
      'checked:invitations',
      { count: 3 }
    )
    expect(testHarness.spies.getConversations).toHaveBeenCalledTimes(1)
  })
})

describe('when an invitation is not a connection', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    await testHarness.receiveInvitation(
      {
        urn: 'urn:li:fsd_invitation:7086734793308078080',
        sharedSecret: 'NifOCrk1',
        inviterTitle: 'Newsletter • Biweekly',
        inviterName:
          'LinkedIn News Europe invited you to subscribe to Tech Wrap-Up Europe',
        sentTimeLabel: '3 days ago',
        inviterId: 'linkedinNews',
      },
      () => {}
    )
  })

  it('should not accept, because it is a newsletter', async () => {
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
  })
})

describe('when there is no openAi key', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()

    await testHarness.receiveInvitation(
      {
        urn: 'urn:li:fsd_invitation:7086734793308078080',
        sentTimeLabel: '2 days ago',
        message: null,
        sharedSecret: 'NifOCrk1',
        inviterTitle: 'Horse riding instructor at Ride Co.',
        inviterName: 'Anush Vasily',
        inviterId: 'anush-the-instructor',
      },
      () => {}
    )
  })

  it('should accept every invitation', async () => {
    expect(testHarness.spies.clickAcceptButtons).toHaveBeenCalledWith([
      'Anush Vasily',
    ])
    expect(testHarness.spies.domDispatch).toHaveBeenCalledWith(
      'checked:invitations',
      { count: 1 }
    )
  })
})

describe('when we have openAi key, but the invitation message is not about a job opportunity', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    testHarness.spies.isAboutJobOpportunity = jest.fn().mockResolvedValue(false)
    testHarness.spies.isInviteeRecruiter = jest.fn().mockResolvedValue(true)
    await testHarness.receiveInvitation(
      {
        urn: 'urn:li:fsd_invitation:7086734793308078080',
        sentTimeLabel: 'Yesterday',
        message: 'Hey, do you remember me? I am Creed',
        sharedSecret: 'NifOCrk1',
        inviterTitle: 'HeadHunter at Dunder Mifflin, Inc.',
        inviterName: 'Pam Beesley',
        inviterId: 'pambeesley',
      },
      () => {}
    )
  })

  it('should not accept the invitation', async () => {
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
    expect(testHarness.spies.domDispatch).toHaveBeenNthCalledWith(
      1,
      'checked:invitations',
      { count: 1 }
    )
    expect(testHarness.spies.domDispatch).toHaveBeenNthCalledWith(
      2,
      'checked:messages',
      { count: 0 }
    )
  })
})

describe('when we have openAi key, no message and the senderTitle is not about a recruiter', () => {
  let testHarness
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    testHarness.spies.isAboutJobOpportunity = jest.fn().mockResolvedValue(false)
    testHarness.spies.isInviteeRecruiter = jest.fn().mockResolvedValue(false)
    testHarness.spies.getConversations = jest.fn().mockResolvedValue([])
    await testHarness.receiveInvitation(
      {
        urn: 'urn:li:fsd_invitation:7086734793308078080',
        sentTimeLabel: '2 days ago',
        sharedSecret: 'NifOCrk1',
        inviterTitle: 'Paper Sales at Dunder Mifflin, Inc.',
        inviterName: 'Jim Halpert',
        inviterId: 'jimhalpert',
      },
      () => {}
    )
  })

  it('should accept no invitation', async () => {
    expect(testHarness.spies.isAboutJobOpportunity).not.toHaveBeenCalled()
    expect(testHarness.spies.acceptInvitation).not.toHaveBeenCalled()
    expect(testHarness.spies.domDispatch).toHaveBeenNthCalledWith(
      1,
      'checked:invitations',
      { count: 0 }
    )
    expect(testHarness.spies.domDispatch).toHaveBeenNthCalledWith(
      2,
      'checked:messages',
      { count: 0 }
    )
  })
})
