import { ProfileUrl } from '../Shared/ProfileUrl'
import {
  EqualizerModel,
  equalizerRepository,
} from '../Equalizer/EqualizerRepository'

export interface PopupModel {
  profileUrl?: string
  profileUrlFull?: string
  isProfileUrlProvided: boolean
  automaticMessage: string
  isOpenAiEnabled: boolean
  onClickSettings?: () => void
}

export class PopupPresenter {
  async load(callback: (settings: PopupModel) => void): Promise<void> {
    await equalizerRepository.load(
      ({
        profileName,
        openAiKey,
        automaticMessage,
        openSettings,
      }: EqualizerModel) => {
        const profileUrl = new ProfileUrl(profileName)

        callback({
          isOpenAiEnabled: Boolean(openAiKey),
          profileUrl: profileUrl.base,
          profileUrlFull: profileUrl.full,
          automaticMessage: profileUrl.replaceInText(automaticMessage),
          isProfileUrlProvided: Boolean(profileName),
          onClickSettings: openSettings,
        })
      }
    )
  }
}
