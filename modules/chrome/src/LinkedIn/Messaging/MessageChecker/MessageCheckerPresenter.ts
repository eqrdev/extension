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

    /**
     * Currently we only support english
     * when we'll have multiple languages, we need
     * `chrome.i18n.getUILanguage()` here.
     */
    const formatter = new Intl.DateTimeFormat('en-US', {
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
