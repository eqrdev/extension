export class LinkedInElements {
  static Selectors = {
    ReplyButtonContainer: '.msg-form__left-actions',
    MessageCheckerPrecedingNode: '.msg-conversations-container__title-row',
    InvitationsCheckerPrecedingNode: '.mn-invitations-preview__header',
  }

  private static getContainerAfter(precedingSelector: string): HTMLDivElement {
    const preceding = document.querySelector(precedingSelector)
    const container = document.createElement('div')
    preceding.parentNode?.insertBefore(container, preceding.nextSibling)
    return container
  }

  private static getContainerInside(parentSelector: string): HTMLDivElement {
    const parent = document.querySelector(parentSelector)
    const container = document.createElement('div')
    parent.appendChild(container)
    return container
  }

  static getReplyButtonContainer(): HTMLDivElement {
    return LinkedInElements.getContainerInside(
      LinkedInElements.Selectors.ReplyButtonContainer
    )
  }

  static getMessageCheckerContainer(): HTMLDivElement {
    return LinkedInElements.getContainerAfter(
      LinkedInElements.Selectors.MessageCheckerPrecedingNode
    )
  }

  static getInvitationsCheckerContainer(): HTMLDivElement {
    return LinkedInElements.getContainerAfter(
      LinkedInElements.Selectors.InvitationsCheckerPrecedingNode
    )
  }
}
