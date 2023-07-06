import { PopupRepository } from './PopupRepository'
import { OptionsRepository } from '../Options/OptionsRepository'

export class PopupPresenter {
  async load(callback): Promise<void> {
    const optionsRepository = new OptionsRepository()
    const popupRepository = new PopupRepository()
    await optionsRepository.getOptions(options => {
      callback({
        isOpenAiEnabled: options.isOpenAiEnabled,
        profileUrl: this.getFullProfileUrl(options.profileUrl),
        automaticMessage: this.getTextWithUrl(
          options.automaticMessage,
          this.getFullProfileUrl(options.profileUrl)
        ),
        isProfileUrlProvided: Boolean(options.profileUrl),
        onClickOptions: () => popupRepository.openOptions(),
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
