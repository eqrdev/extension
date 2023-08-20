import {
  EqualizerModel,
  equalizerRepository,
} from '../../../Equalizer/EqualizerRepository'
import { dateTimeFormatter } from '../../../Shared/i18n'

export interface MessageCheckerData {
  lastChecked: string
  hasLastCheckedDate: boolean
  lastResponsesCount?: number
  shouldShowCheckerButton: boolean
}

export class MessageCheckerPresenter {
  async load(callback: (settings: MessageCheckerData) => void): Promise<void> {
    await equalizerRepository.load(
      ({
        messagesLastCheckedDate,
        profileName,
        lastResponsesCount,
      }: EqualizerModel) => {
        callback({
          lastChecked: messagesLastCheckedDate
            ? dateTimeFormatter.format(new Date(messagesLastCheckedDate))
            : '',
          hasLastCheckedDate: Boolean(messagesLastCheckedDate),
          lastResponsesCount,
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
