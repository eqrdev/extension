import { OptionsRepository } from './OptionsRepository'
import { OptionsComponentProps } from './OptionsComponent'

export class OptionsPresenter {
  async load(
    callback: (options: OptionsComponentProps) => void
  ): Promise<void> {
    const optionsRepository = new OptionsRepository()
    await optionsRepository.getOptions(options => {
      callback({
        isOpenAiEnabled: options.isOpenAiEnabled,
        profileUrl: this.getFullProfileUrl(options.profileUrl),
        profileUrlPart: options.profileUrl,
        automaticMessage: this.getTextWithUrl(
          options.automaticMessage,
          this.getFullProfileUrl(options.profileUrl)
        ),
        isProfileUrlProvided: Boolean(options.profileUrl),
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
