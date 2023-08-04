import { ProfileUrl } from '../../../Shared/ProfileUrl'
import {
  EqualizerModel,
  equalizerRepository,
} from '../../../Equalizer/EqualizerRepository'

export interface MessageCheckerData {
  lastChecked: string
  isProfileUrlProvided: boolean
  automaticMessage: string
  onClickMessages: () => Promise<void>
  onClickSettings: () => Promise<void>
}

export class MessageCheckerPresenter {
  async load(callback: (settings: MessageCheckerData) => void): Promise<void> {
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

    await equalizerRepository.load(
      ({
        messagesLastCheckedDate,
        profileName,
        automaticMessage,
        checkMessages,
        openSettings,
      }: EqualizerModel) => {
        callback({
          isProfileUrlProvided: !!profileName,
          automaticMessage: new ProfileUrl(profileName).replaceInText(
            automaticMessage
          ),
          lastChecked: messagesLastCheckedDate
            ? formatter.format(new Date(messagesLastCheckedDate))
            : undefined,
          onClickMessages: checkMessages,
          onClickSettings: openSettings,
        })
      }
    )
  }
}
