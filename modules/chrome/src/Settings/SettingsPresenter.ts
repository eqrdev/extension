import { EqualizerSettings, SettingsRepository } from './SettingsRepository'
import { ProfileUrl } from '../Shared/ProfileUrl'

export interface SettingsModel {
  profileUrl?: string
  profileUrlFull?: string
  profileName?: string
  isProfileUrlProvided: boolean
  automaticMessage: string
  rawAutomaticMessage: string
  isOpenAiEnabled: boolean
  openAiKey?: string
  onSaveProfileName: (value: string) => Promise<void>
}

export class SettingsPresenter {
  async load(callback: (settings: SettingsModel) => void): Promise<void> {
    const settingsRepository = new SettingsRepository()
    await settingsRepository.getSettings((settings: EqualizerSettings) => {
      const profileUrl = new ProfileUrl(settings.profileName)

      const handleProfileNameChange = async (value: string): Promise<void> => {
        if (typeof value !== 'string') {
          throw new TypeError('IncorrectTypeError')
        }

        if (value === '') {
          throw new Error('EmptyValueError')
        }

        await settingsRepository.set('profileName', value)
      }

      callback({
        isOpenAiEnabled: settings.isOpenAiEnabled,
        profileUrl: profileUrl.base,
        profileUrlFull: profileUrl.full,
        profileName: profileUrl.name,
        automaticMessage: profileUrl.replaceInText(settings.automaticMessage),
        rawAutomaticMessage: settings.automaticMessage,
        isProfileUrlProvided: Boolean(settings.profileName),
        onSaveProfileName: handleProfileNameChange,
      })
    })
  }
}
