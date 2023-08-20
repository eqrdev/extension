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
    expect(testHarness.spies.acceptInvitation).toHaveBeenCalledTimes(1)
  })
})
