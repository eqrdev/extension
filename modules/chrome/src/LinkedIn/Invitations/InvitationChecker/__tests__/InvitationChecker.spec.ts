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
jest.mock('../../../../Shared/OpenAIGateway')
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
          id: 9789428921,
          genericInvitationType: 'CONNECTION',
          sharedSecret: 'NrtQx6ioﬀ',
          message: 'Hello, do you remember me from high school?',
          invitationType: 'RECEIVED',
          invitationState: 'PENDING',
          senderTitle: 'DTP operator at QuickPrint HQ, Inc.',
        },
        {
          id: 4892374874,
          genericInvitationType: 'CONNECTION',
          sharedSecret: 'wlApmssu',
          message: null,
          invitationType: 'RECEIVED',
          invitationState: 'PENDING',
          senderTitle: 'HR associate at HRComm Solutions',
        },
        {
          id: 9867875488,
          genericInvitationType: 'CONNECTION',
          sharedSecret: 'NifOCrk1',
          message: null,
          invitationType: 'RECEIVED',
          invitationState: 'PENDING',
          senderTitle: 'Headhunter at Black and Lockwood',
        },
      ]),
      acceptInvitation: jest.fn(),
    } as unknown as LinkedInClient)

    const presenter = new InvitationCheckerPresenter()
    await presenter.onClickButton()

    expect(equalizerRepository.client.getInvites).toHaveBeenCalledTimes(1)
    expect(equalizerRepository.client.acceptInvitation).toHaveBeenCalledTimes(1)
  })
})
