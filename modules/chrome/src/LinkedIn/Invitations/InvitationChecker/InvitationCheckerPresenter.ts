import { equalizerRepository } from '../../../Equalizer/EqualizerRepository'
import { dateTimeFormatter } from '../../../Shared/i18n'

export interface InvitationModel {
  lastCheck: string
  isProfileNameProvided: boolean
  invitationsAcceptedCount: number
}

export class InvitationCheckerPresenter {
  async load(callback: (settings: InvitationModel) => void): Promise<void> {
    await equalizerRepository.load(
      ({
        invitationsLastCheckedDate,
        profileName,
        invitationsAcceptedCount,
      }) => {
        callback({
          lastCheck: invitationsLastCheckedDate
            ? dateTimeFormatter.format(invitationsLastCheckedDate)
            : null,
          isProfileNameProvided: Boolean(profileName),
          invitationsAcceptedCount:
            invitationsAcceptedCount === undefined
              ? 0
              : invitationsAcceptedCount,
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
