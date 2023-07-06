import { EqualizerSettings, SettingsRepository } from './SettingsRepository'
import { SettingsComponentProps } from './SettingsComponent'

export class SettingsPresenter {
  async load(
    callback: (settings: SettingsComponentProps) => void
  ): Promise<void> {
    const settingsRepository = new SettingsRepository()
    await settingsRepository.getSettings((settings: EqualizerSettings) => {
      callback({
        isOpenAiEnabled: settings.isOpenAiEnabled,
        profileUrl: this.getFullProfileUrl(settings.profileName),
        profileUrlPart: settings.profileName,
        automaticMessage: this.getTextWithUrl(
          settings.automaticMessage,
          this.getFullProfileUrl(settings.profileName)
        ),
        isProfileUrlProvided: Boolean(settings.profileName),
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
