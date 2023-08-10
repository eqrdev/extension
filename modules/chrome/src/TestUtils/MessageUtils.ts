import { MessageCheckerPresenter } from '../LinkedIn/Messaging/MessageChecker/MessageCheckerPresenter'

interface MessageUtilsConfig {
  profileName?: string
  lastChecked?: Date
  automaticMessage?: string
  hasOpenAiKey?: boolean
}

export class MessageUtils {
  private messageCheckerPresenter: MessageCheckerPresenter

  init({
    profileName = 'my-profile-name',
    lastChecked = new Date('2023-10-10'),
    automaticMessage = 'My message',
    hasOpenAiKey = true,
  }: MessageUtilsConfig) {
    jest.resetAllMocks()

    jest.mock('../../../../Shared/ChromeMessageGateway')
    jest.mock('../../../../Shared/ChromeStorageGateway')
    jest.mock('../../../../Shared/OpenAIGateway')
    jest.mock('../../../../Shared/LinkedInAPIGateway')

    this.messageCheckerPresenter = new MessageCheckerPresenter()
  }
}
