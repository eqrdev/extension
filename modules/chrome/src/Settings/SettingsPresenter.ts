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
  onSaveProfileName(value: string): Promise<void>
  onSaveMessage(value: string): Promise<void>
  onSaveApiKey(value: string): Promise<void>
  disableOpenAi(): Promise<void>
}

export class SettingsPresenter {
  async load(callback: (settings: SettingsModel) => void): Promise<void> {
    const settingsRepository = new SettingsRepository()
    await settingsRepository.getSettings((settings: EqualizerSettings) => {
      const profileUrl = new ProfileUrl(settings.profileName)

      const handleSimpleText = async (
        key: keyof EqualizerSettings,
        value: string
      ): Promise<void> => {
        if (typeof value !== 'string') {
          throw new TypeError('IncorrectTypeError')
        }

        if (value === '') {
          throw new Error('EmptyValueError')
        }

        await settingsRepository.set(key, value)
      }

      const handleProfileNameChange = async (value: string): Promise<void> =>
        handleSimpleText('profileName', value)

      const handleMessageChange = async (value: string): Promise<void> =>
        handleSimpleText('automaticMessage', value)

      const handleApiKeyChange = async (value: string): Promise<void> =>
        handleSimpleText('openAiKey', value)

      const handleDisabledOpenAi = async () =>
        settingsRepository.remove('openAiKey')

      callback({
        isOpenAiEnabled: !!settings.openAiKey,
        openAiKey: settings.openAiKey,
        profileUrl: profileUrl.base,
        profileUrlFull: profileUrl.full,
        profileName: profileUrl.name,
        automaticMessage: profileUrl.replaceInText(settings.automaticMessage),
        rawAutomaticMessage: settings.automaticMessage,
        isProfileUrlProvided: Boolean(settings.profileName),
        onSaveProfileName: handleProfileNameChange,
        onSaveMessage: handleMessageChange,
        onSaveApiKey: handleApiKeyChange,
        disableOpenAi: handleDisabledOpenAi,
      })
    })
  }
}
