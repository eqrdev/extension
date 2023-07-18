import { ProfileUrl } from '../../../Shared/ProfileUrl'
import {
  EqualizerModel,
  EqualizerRepository,
} from '../../../Equalizer/EqualizerRepository'

export interface MessageCheckerData {
  lastChecked: string
  isProfileUrlProvided: boolean
  automaticMessage: string
  onClickMessages: () => Promise<void>
}

export class MessageCheckerPresenter {
  async load(callback: (settings: MessageCheckerData) => void): Promise<void> {
    const repository = new EqualizerRepository()

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

    await repository.load(
      ({
        messagesLastCheckedDate,
        profileName,
        automaticMessage,
        checkMessages,
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
        })
      }
    )
  }
}
