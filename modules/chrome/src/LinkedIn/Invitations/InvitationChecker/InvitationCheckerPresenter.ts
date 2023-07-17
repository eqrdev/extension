import { InvitationCheckerRepository } from './InvitationCheckerRepository'

export interface InvitationModel {
  lastCheck: string
  onClickButton: () => void
}

export class InvitationCheckerPresenter {
  async load(callback: (settings: InvitationModel) => void): Promise<void> {
    const repository = new InvitationCheckerRepository()
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    await repository.getData(({ lastCheck }) => {
      callback({
        lastCheck: formatter.format(lastCheck),
        onClickButton: repository.checkInvitations,
      })
    })
  }
}
