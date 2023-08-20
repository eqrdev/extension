import { EqualizerTestHarness } from '../../TestUtils/EqualizerTestHarness'

jest.mock('../../Shared/Gateways/CrossThreadGateway')
jest.mock('../../Shared/Gateways/StorageGateway')

describe('when no profileName provided', () => {
  let viewModel
  let testHarness

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({ profileName: null })
    await testHarness.initSettings(data => {
      viewModel = data
    })
  })

  it('should show an alert', async () => {
    expect(viewModel.isProfileUrlProvided).toBe(false)
  })
})

describe('when we click on save', () => {
  let viewModel
  let testHarness

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({ profileName: null })
    await testHarness.initSettings(data => {
      viewModel = data
    })
  })

  it('should call the storages appropriate method', async () => {
    expect(viewModel).not.toBe(null)
    await testHarness.settingsPresenter.onSaveProfileName('dwight_schrute')
    expect(testHarness.spies.setSyncedData).toHaveBeenCalledWith(
      'profileName',
      'dwight_schrute'
    )
    await testHarness.settingsPresenter.onSaveMessage(
      'Bears. Beets. Battlestar Galactica.'
    )
    expect(testHarness.spies.setSyncedData).toHaveBeenCalledWith(
      'automaticMessage',
      'Bears. Beets. Battlestar Galactica.'
    )
  })
})

describe('when we click on save and the input is empty or incorrect', () => {
  let viewModel
  let testHarness

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness({ profileName: null })
    await testHarness.initSettings(data => {
      viewModel = data
    })
  })

  it('should throw an error', async () => {
    expect(viewModel).not.toBe(null)
    await expect(async () => {
      await testHarness.settingsPresenter.onSaveProfileName('')
    }).rejects.toThrow('EmptyValueError')

    await expect(async () => {
      await testHarness.settingsPresenter.onSaveProfileName(
        'my_new profileName'
      )
    }).rejects.toThrow('IncorrectFormatError')
  })
})
