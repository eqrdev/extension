import { equalizerRepository } from '../../../Equalizer/EqualizerRepository'

export interface InvitationModel {
  lastCheck: string
  onClickButton: () => void
  onClickSettings: () => void
  isProfileNameProvided: boolean
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
        checkInvitations,
        profileName,
        openSettings,
      }) => {
        callback({
          lastCheck: invitationsLastCheckedDate
            ? formatter.format(invitationsLastCheckedDate)
            : null,
          isProfileNameProvided: Boolean(profileName),
          onClickButton: checkInvitations,
          onClickSettings: openSettings,
        })
      }
    )
  }
}
