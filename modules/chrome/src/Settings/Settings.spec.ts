import { EqualizerTestHarness } from '../TestUtils/EqualizerTestHarness'

jest.mock('../Shared/Gateways/CrossThreadGateway')
jest.mock('../Shared/Gateways/StorageGateway')

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

describe('when we click on save in sections like profileName or automaticMessage', () => {
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
      'Bears. Beets. Battlestar Galactica. #URL#'
    )
    expect(testHarness.spies.setSyncedData).toHaveBeenCalledWith(
      'automaticMessage',
      'Bears. Beets. Battlestar Galactica. #URL#'
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

describe('when we try to save automatic message without providing an #URL# string in it', () => {
  let testHarness

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    await testHarness.initSettings(() => {})
  })

  it('should validate the key and save into the synced storage', async () => {
    await expect(async () => {
      await testHarness.settingsPresenter.onSaveMessage(
        'My message does not contain url'
      )
    }).rejects.toThrow('MissingUrlError')
  })
})

describe('when we click on save openAi key', () => {
  let testHarness

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    await testHarness.initSettings(() => {})
  })

  it('should validate the key and save into the synced storage', async () => {
    await testHarness.settingsPresenter.onSaveApiKey('my-api-key')

    expect(testHarness.spies.isKeyValid).toHaveBeenCalledWith('my-api-key')

    expect(testHarness.spies.setSyncedData).toHaveBeenCalledWith(
      'openAiKey',
      'my-api-key'
    )
  })
})

describe('when the api key is invalid', () => {
  let testHarness

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    testHarness.spies.isKeyValid = jest.fn().mockResolvedValue(false)
    await testHarness.initSettings(() => {})
  })

  it('should validate the key and save into the synced storage', async () => {
    await expect(async () => {
      await testHarness.settingsPresenter.onSaveApiKey('my-api-key')
    }).rejects.toThrow('IncorrectValueError')

    expect(testHarness.spies.isKeyValid).toHaveBeenCalledWith('my-api-key')

    expect(testHarness.spies.setSyncedData).not.toHaveBeenCalled()
  })
})

describe('when we click on disable OpenAI', () => {
  let testHarness

  beforeEach(async () => {
    testHarness = new EqualizerTestHarness()
    await testHarness.initSettings(() => {})
  })

  it('should remove the openAi key from the synced storage', async () => {
    await testHarness.settingsPresenter.disableOpenAi()
    expect(testHarness.spies.removeSyncedData).toHaveBeenCalledWith('openAiKey')
  })
})
