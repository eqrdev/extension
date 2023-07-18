import { ProfileUrl } from '../../../Shared/ProfileUrl'
import {
  EqualizerModel,
  EqualizerRepository,
} from '../../../Equalizer/EqualizerRepository'

export interface LinkedInModel {
  isProfileUrlProvided: boolean
  automaticMessage: string
}

export class ReplyButtonPresenter {
  async load(callback: (settings: LinkedInModel) => void): Promise<void> {
    const repository = new EqualizerRepository()

    await repository.load(
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
