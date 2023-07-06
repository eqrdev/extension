import { EqualizerSettings, SettingsRepository } from './SettingsRepository'
import { SettingsComponentProps } from './SettingsComponent'
import { ProfileUrl } from '../Shared/ProfileUrl'

export class SettingsPresenter {
  async load(
    callback: (settings: SettingsComponentProps) => void
  ): Promise<void> {
    const settingsRepository = new SettingsRepository()
    await settingsRepository.getSettings((settings: EqualizerSettings) => {
      const profileUrl = new ProfileUrl(settings.profileName)

      const handleProfileNameChange = (value: string): void => {
        if (typeof value !== 'string') {
          throw new TypeError('IncorrectTypeError')
        }

        if (value === '') {
          throw new Error('EmptyValueError')
        }

        settingsRepository.set('profileName', value)
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
