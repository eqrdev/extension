import { ProfileUrl } from 'equalizer'
import {
  EqualizerModel,
  equalizerRepository,
} from '../Equalizer/EqualizerRepository'

export interface SettingsModel {
  profileUrl?: string
  profileUrlFull?: string
  profileName?: string
  isProfileUrlProvided: boolean
  automaticMessage: string
  rawAutomaticMessage: string
  isOpenAiEnabled: boolean
  openAiKey?: string
}

const maskOpenAIKey = (key: string) =>
  key.substring(0, 3) + '********' + key.substring(key.length - 4)

export class SettingsPresenter {
  async load(callback: (settings: SettingsModel) => void): Promise<void> {
    await equalizerRepository.load(
      ({ profileName, openAiKey, automaticMessage }: EqualizerModel) => {
        const profileUrl = new ProfileUrl(profileName)
        callback({
          isOpenAiEnabled: !!openAiKey,
          openAiKey: openAiKey ? maskOpenAIKey(openAiKey) : openAiKey,
          profileUrl: profileUrl.base,
          profileUrlFull: profileUrl.full,
          profileName: profileUrl.name,
          automaticMessage: profileUrl.replaceInText(automaticMessage),
          rawAutomaticMessage: automaticMessage,
          isProfileUrlProvided: Boolean(profileName),
        })
      }
    )
  }

  async onSaveProfileName(profileName: string) {
    await equalizerRepository.set('profileName', profileName)
  }

  async onSaveMessage(message: string) {
    await equalizerRepository.set('automaticMessage', message)
  }
  async onSaveApiKey(apiKey: string) {
    await equalizerRepository.set('openAiKey', apiKey)
  }
  async disableOpenAi() {
    await equalizerRepository.remove('openAiKey')
  }
}
