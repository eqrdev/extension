import {
  EqualizerModel,
  equalizerRepository,
} from '../../../Equalizer/EqualizerRepository'
import { dateTimeFormatter } from '../../../Shared/i18n'

export interface MessageCheckerData {
  lastChecked: string
  hasLastCheckedDate: boolean
  shouldShowCheckerButton: boolean
}

export class MessageCheckerPresenter {
  async load(callback: (settings: MessageCheckerData) => void): Promise<void> {
    await equalizerRepository.load(
      ({ messagesLastCheckedDate, profileName }: EqualizerModel) => {
        callback({
          lastChecked: messagesLastCheckedDate
            ? dateTimeFormatter.format(new Date(messagesLastCheckedDate))
            : '',
          hasLastCheckedDate: Boolean(messagesLastCheckedDate),
          shouldShowCheckerButton: Boolean(profileName),
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
