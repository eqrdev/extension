import { PopupRepository } from './PopupRepository'
import {
  EqualizerSettings,
  SettingsRepository,
} from '../Settings/SettingsRepository'
import { PopupComponentProps } from './PopupComponent'
import { ProfileUrl } from '../Shared/ProfileUrl'

export class PopupPresenter {
  async load(callback: (settings: PopupComponentProps) => void): Promise<void> {
    const settingsRepository = new SettingsRepository()
    const popupRepository = new PopupRepository()
    await settingsRepository.getSettings((settings: EqualizerSettings) => {
      const profileUrl = new ProfileUrl(settings.profileName)

      callback({
        isOpenAiEnabled: settings.isOpenAiEnabled,
        profileUrl: profileUrl.base,
        profileUrlFull: profileUrl.full,
        automaticMessage: profileUrl.replaceInText(settings.automaticMessage),
        isProfileUrlProvided: Boolean(settings.profileName),
        onClickSettings: popupRepository.openSettings,
      })
    })
  }
}
