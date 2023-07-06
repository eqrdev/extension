import { PopupRepository } from './PopupRepository'
import {
  EqualizerSettings,
  SettingsRepository,
} from '../Settings/SettingsRepository'
import { PopupComponentProps } from './PopupComponent'

export class PopupPresenter {
  async load(callback: (settings: PopupComponentProps) => void): Promise<void> {
    const settingsRepository = new SettingsRepository()
    const popupRepository = new PopupRepository()
    await settingsRepository.getSettings((settings: EqualizerSettings) => {
      callback({
        isOpenAiEnabled: settings.isOpenAiEnabled,
        profileUrl: this.getFullProfileUrl(settings.profileName),
        automaticMessage: this.getTextWithUrl(
          settings.automaticMessage,
          this.getFullProfileUrl(settings.profileName)
        ),
        isProfileUrlProvided: Boolean(settings.profileName),
        onClickSettings: () => popupRepository.openSettings(),
      })
    })
  }

  private getFullProfileUrl(urlPart: string): string {
    return urlPart ? `https://equalizer.dev/me/${urlPart}` : ''
  }

  private getTextWithUrl(rawText: string, url: string): string {
    return rawText.replaceAll(/#URL#/g, url)
  }
}
