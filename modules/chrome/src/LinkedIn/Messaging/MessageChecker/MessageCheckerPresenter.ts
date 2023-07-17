import {
  MessageCheckerRepository,
  MessagingData,
} from './MessageCheckerRepository'
import { ProfileUrl } from '../../../Shared/ProfileUrl'

export interface MessageCheckerData {
  lastChecked: string
  isProfileUrlProvided: boolean
  automaticMessage: string
  onClickMessages: () => Promise<void>
}

export class MessageCheckerPresenter {
  async load(callback: (settings: MessageCheckerData) => void): Promise<void> {
    const messageCheckerRepository = new MessageCheckerRepository()
    const formatter = new Intl.DateTimeFormat(chrome.i18n.getUILanguage(), {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    await messageCheckerRepository.getData(
      ({ lastChecked, profileName, automaticMessage }: MessagingData) => {
        const profileUrl = new ProfileUrl(profileName)
        callback({
          isProfileUrlProvided: !!profileName,
          automaticMessage: profileUrl.replaceInText(automaticMessage),
          lastChecked: lastChecked
            ? formatter.format(new Date(lastChecked))
            : undefined,
          onClickMessages: async () => {
            await messageCheckerRepository.checkMessages()
          },
        })
      }
    )
  }
}
