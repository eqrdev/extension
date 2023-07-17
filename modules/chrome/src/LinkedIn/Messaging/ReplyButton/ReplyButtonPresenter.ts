import {
  EqualizerSettings,
  SettingsRepository,
} from '../../../Settings/SettingsRepository'
import { ProfileUrl } from '../../../Shared/ProfileUrl'

export interface LinkedInModel {
  isProfileUrlProvided: boolean
  automaticMessage: string
}

export class ReplyButtonPresenter {
  async load(callback: (settings: LinkedInModel) => void): Promise<void> {
    const settingsRepository = new SettingsRepository()

    await settingsRepository.getSettings((settings: EqualizerSettings) => {
      const profileUrl = new ProfileUrl(settings.profileName)

      callback({
        automaticMessage: profileUrl.replaceInText(settings.automaticMessage),
        isProfileUrlProvided: Boolean(settings.profileName),
      })
    })
  }
}
