import { SettingsModel, SettingsPresenter } from '../SettingsPresenter'
import { equalizerRepository } from '../../Equalizer/EqualizerRepository'

jest.mock('../../Shared/ChromeMessageGateway')
jest.mock('../../Shared/ChromeStorageGateway')

describe('when no profileName provided', () => {
  it('should show an alert', async () => {
    const settingsPresenter = new SettingsPresenter()
    let viewModel: SettingsModel
    await settingsPresenter.load(model => {
      viewModel = model
    })
    expect(viewModel.isProfileUrlProvided).toBe(false)
  })
})

describe('when we click on save', () => {
  it('should call the storages appropriate method', async () => {
    const settingsPresenter = new SettingsPresenter()
    let viewModel: SettingsModel
    await settingsPresenter.load(model => {
      viewModel = model
    })
    await viewModel.onSaveProfileName('dwight_schrute')
    await viewModel.onSaveMessage('Bears. Beets. Battlestar Galactica.')
    expect(equalizerRepository.syncStorage.set).toHaveBeenCalledWith({
      profileName: 'dwight_schrute',
    })
    expect(equalizerRepository.syncStorage.set).toHaveBeenCalledWith({
      automaticMessage: 'Bears. Beets. Battlestar Galactica.',
    })
  })
})

describe('when we click on save and the input is empty or incorrect', () => {
  it('should throw an error', async () => {
    const settingsPresenter = new SettingsPresenter()
    let viewModel: SettingsModel
    await settingsPresenter.load(model => {
      viewModel = model
    })
    await expect(async () => {
      await viewModel.onSaveProfileName('')
    }).rejects.toThrow('EmptyValueError')

    await expect(async () => {
      await viewModel.onSaveProfileName('my_new profileName')
    }).rejects.toThrow('IncorrectFormatError')
  })
})
