import { PopupModel, PopupPresenter } from '../PopupPresenter'
import { equalizerRepository } from '../../Equalizer/EqualizerRepository'

jest.mock('../../Shared/ChromeMessageGateway')
jest.mock('../../Shared/ChromeStorageGateway')

describe('when we click on settings button', () => {
  it('should call the messageGateway with a specific message', async () => {
    const popupPresenter = new PopupPresenter()
    let openSettings
    await popupPresenter.load(viewModel => {
      openSettings = viewModel.onClickSettings
    })
    openSettings()
    expect(equalizerRepository.messageGateway.send).toHaveBeenCalledWith({
      type: 'OpenSettings',
    })
  })
})

describe('when the profileName is not provided', () => {
  it("shouldn't show an alert", async () => {
    const popupPresenter = new PopupPresenter()
    let profileNameProvided
    await popupPresenter.load(viewModel => {
      profileNameProvided = viewModel.isProfileUrlProvided
    })
    expect(profileNameProvided).toBe(false)
  })
})

describe('when the profileName is provided', () => {
  it('should show an alert', async () => {
    equalizerRepository.syncStorage.getAll = jest
      .fn()
      .mockImplementation(() => ({
        profileName: 'dwight-schrute',
        openAiKey: '8848783',
      }))
    const popupPresenter = new PopupPresenter()
    let viewModel: PopupModel
    await popupPresenter.load(model => {
      viewModel = model
    })
    expect(viewModel.isProfileUrlProvided).toBe(true)
    expect(viewModel.profileUrl).toBe('equalizer.dev/me/dwight-schrute')
    expect(viewModel.profileUrlFull).toBe(
      'https://equalizer.dev/me/dwight-schrute'
    )
    expect(viewModel.isOpenAiEnabled).toBe(true)
  })
})
