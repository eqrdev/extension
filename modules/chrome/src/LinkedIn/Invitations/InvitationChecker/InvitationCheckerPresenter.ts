import { equalizerRepository } from '../../../Equalizer/EqualizerRepository'
import { dateTimeFormatter } from '../../../Shared/i18n'

export interface InvitationModel {
  lastCheck: string
  isProfileNameProvided: boolean
}

export class InvitationCheckerPresenter {
  async load(callback: (settings: InvitationModel) => void): Promise<void> {
    await equalizerRepository.load(
      ({ invitationsLastCheckedDate, profileName }) => {
        callback({
          lastCheck: invitationsLastCheckedDate
            ? dateTimeFormatter.format(invitationsLastCheckedDate)
            : null,
          isProfileNameProvided: Boolean(profileName),
        })
      }
    )
  }

  async onClickButton() {
    await equalizerRepository.checkInvitations()
  }

  async onClickSettings() {
    await equalizerRepository.openSettings()
  }
}
