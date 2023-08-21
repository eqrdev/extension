import {
  EqualizerModel,
  equalizerRepository,
} from '../Equalizer/EqualizerRepository'
import { Observable } from '../Shared/Observable'
import { InvitationCheckerPresenter } from '../LinkedIn/Invitations/InvitationChecker/InvitationCheckerPresenter'
import { invitationsStub } from '../LinkedIn/Invitations/InvitationChecker/__tests__/__stubs__/stubs'
import { MessageCheckerPresenter } from '../LinkedIn/Messaging/MessageChecker/MessageCheckerPresenter'
import { PopupPresenter } from '../Popup/PopupPresenter'
import {
  conversationsStub,
  conversationStub,
} from '../LinkedIn/Messaging/MessageChecker/__tests__/__stubs__/stubs'
import { SettingsPresenter } from '../Settings/SettingsPresenter'
import { Invitation } from 'linkedin'

type ViewModel = Partial<EqualizerModel>

export class EqualizerTestHarness {
  messageCheckerPresenter = new MessageCheckerPresenter()
  invitationCheckerPresenter = new InvitationCheckerPresenter()
  popupPresenter = new PopupPresenter()
  settingsPresenter = new SettingsPresenter()
  equalizerRepository = equalizerRepository
  viewModel: ViewModel = {}

  constructor(data?: ViewModel) {
    this.viewModel = data
  }

  get viewModelSpy(): jest.Mock {
    return jest.fn().mockResolvedValue({
      profileName: 'my-profile-name',
      messagesLastCheckedDate: new Date('2023-10-08'),
      automaticMessage: 'My message',
      openAiKey: 'my-openai-key',
      ...this.viewModel,
    })
  }

  spies: Record<string, jest.Mock> = {
    isRecruiterMessage: jest.fn().mockResolvedValue(true),
    isRecruiterTitle: jest.fn().mockResolvedValue(true),
    hasOpenAi: jest.fn().mockReturnValue(true),
    isKeyValid: jest.fn().mockResolvedValue(true),
    getConversations: jest.fn().mockResolvedValue(conversationsStub),
    getConversation: jest.fn().mockResolvedValue(conversationStub),
    sendMessage: jest.fn(),
    acceptInvitation: jest.fn(),
    getInvitations: jest.fn().mockResolvedValue(invitationsStub),
    setSessionData: jest.fn(),
    setSyncedData: jest.fn(),
    getAllData: this.viewModelSpy,
    openSettings: jest.fn(),
    addProfileName: jest.fn(),
    removeSyncedData: jest.fn(),
  }

  private initSpies() {
    jest.clearAllMocks()

    const repository = this.equalizerRepository

    repository.programmersModel = new Observable(null)

    repository.getOpenAiGateway = jest.fn().mockReturnValue({
      isRecruiterMessage: this.spies.isRecruiterMessage,
      isRecruiterTitle: this.spies.isRecruiterTitle,
      hasOpenAi: this.spies.hasOpenAi,
      isKeyValid: this.spies.isKeyValid,
    })
    repository.getLinkedinGateway = jest.fn().mockResolvedValue({
      getInvitations: this.spies.getInvitations,
      acceptInvitation: this.spies.acceptInvitation,
      getConversations: this.spies.getConversations,
      getConversation: this.spies.getConversation,
      sendMessage: this.spies.sendMessage,
    })
    repository.storageGateway = jest.fn().mockReturnValue({
      setSessionData: this.spies.setSessionData,
      setSyncedData: this.spies.setSyncedData,
      getAllData: this.viewModelSpy,
      removeSyncedData: this.spies.removeSyncedData,
    })()
    repository.dateTimeGateway = jest.fn().mockReturnValue({
      now: jest.fn().mockReturnValue(new Date('2023-10-10:10:10')),
    })()
    repository.crossThreadGateway = jest.fn().mockReturnValue({
      openSettings: this.spies.openSettings,
      addProfileName: this.spies.addProfileName,
    })()
  }

  async initInvitationChecker(callback) {
    this.initSpies()
    await this.invitationCheckerPresenter.load(callback)
  }

  async initMessageChecker(callback) {
    this.initSpies()
    await this.messageCheckerPresenter.load(callback)
  }

  async initPopup(callback) {
    this.initSpies()
    await this.popupPresenter.load(callback)
  }

  async initSettings(callback) {
    this.initSpies()
    await this.settingsPresenter.load(callback)
  }

  async receiveInvitation(invitation: Invitation) {
    this.spies.getInvitations = jest.fn().mockResolvedValue([invitation])
    this.initSpies()
    await this.invitationCheckerPresenter.onClickButton()
  }
}
