import { equalizerRepository } from '../../../Equalizer/EqualizerRepository'

export interface InvitationModel {
  lastCheck: string
  isProfileNameProvided: boolean
  invitationsAccepted?: number
}

export class InvitationCheckerPresenter {
  async load(callback: (settings: InvitationModel) => void): Promise<void> {
    /**
     * Currently we only support english
     * when we'll have multiple languages, we need
     * `chrome.i18n.getUILanguage()` here.
     */
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    await equalizerRepository.load(
      ({
        invitationsLastCheckedDate,
        profileName,
        invitationsAcceptedCount,
      }) => {
        callback({
          lastCheck: invitationsLastCheckedDate
            ? formatter.format(invitationsLastCheckedDate)
            : null,
          isProfileNameProvided: Boolean(profileName),
          invitationsAccepted: invitationsAcceptedCount,
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
