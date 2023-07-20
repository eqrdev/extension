import { ProfileUrl } from '../Shared/ProfileUrl'
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
  onSaveProfileName(value: string): Promise<void>
  onSaveMessage(value: string): Promise<void>
  onSaveApiKey(value: string): Promise<void>
  disableOpenAi(): Promise<void>
}

export class SettingsPresenter {
  async load(callback: (settings: SettingsModel) => void): Promise<void> {
    await equalizerRepository.load(
      ({ profileName, openAiKey, automaticMessage }: EqualizerModel) => {
        const profileUrl = new ProfileUrl(profileName)

        const handleProfileNameChange = async (value: string): Promise<void> =>
          equalizerRepository.set('profileName', value)

        const handleMessageChange = async (value: string): Promise<void> =>
          equalizerRepository.set('automaticMessage', value)

        const handleApiKeyChange = async (value: string): Promise<void> =>
          equalizerRepository.set('openAiKey', value)

        const handleDisabledOpenAi = async () =>
          equalizerRepository.remove('openAiKey')

        callback({
          isOpenAiEnabled: !!openAiKey,
          openAiKey: openAiKey,
          profileUrl: profileUrl.base,
          profileUrlFull: profileUrl.full,
          profileName: profileUrl.name,
          automaticMessage: profileUrl.replaceInText(automaticMessage),
          rawAutomaticMessage: automaticMessage,
          isProfileUrlProvided: Boolean(profileName),
          onSaveProfileName: handleProfileNameChange,
          onSaveMessage: handleMessageChange,
          onSaveApiKey: handleApiKeyChange,
          disableOpenAi: handleDisabledOpenAi,
        })
      }
    )
  }
}
