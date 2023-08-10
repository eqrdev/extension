import { MessageCheckerPresenter } from '../MessageCheckerPresenter'

jest.mock('../../../../Shared/ChromeMessageGateway')
jest.mock('../../../../Shared/ChromeStorageGateway')
jest.mock('../../../../Shared/OpenAIGateway')
jest.mock('../../../../Shared/LinkedInAPIGateway', () => ({
  getInvitations: jest.fn().mockResolvedValue([]),
  getConversations: jest.fn().mockResolvedValue([]),
}))

describe('When profile url is not provided by the user', () => {
  it('isProfileUrlProvided should return false', async () => {
    const presenter = new MessageCheckerPresenter()
    let viewModel = null
    await presenter.load(data => {
      viewModel = data
    })
    expect(viewModel.isProfileUrlProvided).toBe(false)
  })
})
