import {
  InvitationCheckerPresenter,
  InvitationModel,
} from '../InvitationCheckerPresenter'
import {
  EqualizerRepository,
  equalizerRepository,
} from '../../../../Equalizer/EqualizerRepository'
import { LinkedInClient } from 'linkedin'

jest.mock('../../../../Shared/ChromeMessageGateway')
jest.mock('../../../../Shared/ChromeStorageGateway')
jest.mock('linkedin', () => ({
  LinkedInClient: jest.fn().mockImplementation(() => ({
    getInvites: jest.fn().mockResolvedValue([]),
  })),
}))

describe('when we have a last checked date', () => {
  it('should present the appropriate format', async () => {
    equalizerRepository.syncStorage.getAll = jest
      .fn()
      .mockImplementation(() => ({
        invitationsLastCheckedDate: 1689862146328,
      }))

    const presenter = new InvitationCheckerPresenter()
    let viewModel: InvitationModel
    await presenter.load(model => {
      viewModel = model
    })

    expect(viewModel.lastCheck).toBe('July 20, 2023')
  })
})

describe('when we click the button', () => {
  it('should call the LinkedIn client with the proper parameters', async () => {
    jest.spyOn(EqualizerRepository.prototype, 'client', 'get').mockReturnValue({
      getInvites: jest.fn().mockResolvedValue([
        {
          invitation: {
            invitationId: '9789428921',
          },
        },
        {
          invitation: {
            invitationId: '4892374874',
          },
        },
        {
          invitation: {
            invitationId: '9867875488',
          },
        },
      ]),
      acceptInvitation: jest.fn(),
    } as unknown as LinkedInClient)

    const presenter = new InvitationCheckerPresenter()
    let viewModel: InvitationModel
    await presenter.load(model => {
      viewModel = model
    })

    await viewModel.onClickButton()

    expect(equalizerRepository.client.getInvites).toHaveBeenCalledTimes(1)
    expect(equalizerRepository.client.acceptInvitation).toHaveBeenCalledTimes(3)
  })
})
