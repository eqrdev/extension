import { ProfileUrl } from '../../../Shared/ProfileUrl'
import {
  EqualizerModel,
  equalizerRepository,
} from '../../../Equalizer/EqualizerRepository'
import { dateTimeFormatter } from '../../../Shared/i18n'

export interface MessageCheckerData {
  lastChecked: string
  hasLastCheckedDate: boolean
  isProfileUrlProvided: boolean
  automaticMessage: string
  lastResponsesCount?: number
}

export class MessageCheckerPresenter {
  async load(callback: (settings: MessageCheckerData) => void): Promise<void> {
    await equalizerRepository.load(
      ({
        messagesLastCheckedDate,
        profileName,
        automaticMessage,
        lastResponsesCount,
      }: EqualizerModel) => {
        callback({
          isProfileUrlProvided: !!profileName,
          automaticMessage: new ProfileUrl(profileName).replaceInText(
            automaticMessage
          ),
          lastChecked: messagesLastCheckedDate
            ? dateTimeFormatter.format(new Date(messagesLastCheckedDate))
            : '',
          hasLastCheckedDate: Boolean(messagesLastCheckedDate),
          lastResponsesCount,
        })
      }
    )
  }

  async onClickMessages() {
    await equalizerRepository.checkMessages()
  }

  async onClickSettings() {
    await equalizerRepository.openSettings()
  }
}
