import { ProfileUrl } from '../../../Shared/ProfileUrl'
import {
  EqualizerModel,
  equalizerRepository,
} from '../../../Equalizer/EqualizerRepository'

export interface LinkedInModel {
  isProfileUrlProvided: boolean
  automaticMessage: string
}

export class ReplyButtonPresenter {
  async load(callback: (settings: LinkedInModel) => void): Promise<void> {
    await equalizerRepository.load(
      ({ profileName, automaticMessage }: EqualizerModel) => {
        const profileUrl = new ProfileUrl(profileName)

        callback({
          automaticMessage: profileUrl.replaceInText(automaticMessage),
          isProfileUrlProvided: Boolean(profileName),
        })
      }
    )
  }
}
