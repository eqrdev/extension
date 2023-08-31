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
}

export class PopupPresenter {
  async load(callback: (settings: PopupModel) => void): Promise<void> {
    await equalizerRepository.load(
      ({ profileName, openAiKey, automaticMessage }: EqualizerModel) => {
        const profileUrl = new ProfileUrl(profileName)
        const isProfileUrlProvided = Boolean(profileName)

        callback({
          isOpenAiEnabled: Boolean(openAiKey),
          profileUrl: profileUrl.base,
          profileUrlFull: profileUrl.full,
          automaticMessage: isProfileUrlProvided
            ? profileUrl.replaceInText(automaticMessage)
            : profileUrl.replaceWithPlaceholder(automaticMessage),
          isProfileUrlProvided,
        })
      }
    )
  }

  async onClickSettings() {
    await equalizerRepository.openSettings()
  }
}
