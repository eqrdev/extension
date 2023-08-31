import { EqualizerTestHarness } from '../../TestUtils/EqualizerTestHarness'

describe('when we click on settings button', () => {
  let testHarness = null

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    await testHarness.initPopup(() => {})
  })

  it('should call the messageGateway with a specific message', async () => {
    await testHarness.popupPresenter.onClickSettings()
    expect(testHarness.spies.openSettings).toHaveBeenCalledTimes(1)
  })
})

describe('when the profileName is not provided', () => {
  let viewModel
  let testHarness = null
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({ profileName: null })
    await testHarness.initPopup(data => {
      viewModel = data
    })
  })

  it("shouldn't show an alert", async () => {
    expect(viewModel.isProfileUrlProvided).toBe(false)
  })

  it('should show a temporary url in automatic message', () => {
    expect(viewModel.automaticMessage).toBe(
      'My message: https://equalizer.dev/me/my-profile'
    )
  })
})

describe('when the profileName is provided', () => {
  let viewModel
  let testHarness = null
  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({
      profileName: 'dwight-schrute',
      openAiKey: '8848783',
    })
    await testHarness.initPopup(data => {
      viewModel = data
    })
  })
  it('should show an alert', async () => {
    expect(viewModel.isProfileUrlProvided).toBe(true)
    expect(viewModel.profileUrl).toBe('equalizer.dev/me/dwight-schrute')
    expect(viewModel.profileUrlFull).toBe(
      'https://equalizer.dev/me/dwight-schrute'
    )
    expect(viewModel.isOpenAiEnabled).toBe(true)
    expect(viewModel.automaticMessage).toBe(
      'My message: https://equalizer.dev/me/dwight-schrute'
    )
  })
})
