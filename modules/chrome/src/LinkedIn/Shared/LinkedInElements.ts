export class LinkedInElements {
  static Selectors = {
    ReplyButtonContainer: '.msg-form__left-actions',
    MessageCheckerPrecedingNode: '.msg-conversations-container__title-row',
    InvitationsCheckerPrecedingNode: '.mn-invitations-preview__header',
  }

  private static getContainer(id: string) {
    const existingContainer = document.querySelector<HTMLDivElement>(
      `[data-eq-root="${id}"]`
    )
    if (existingContainer) {
      return existingContainer
    }

    const container = document.createElement('div')
    container.dataset.eqRoot = id
    return container
  }

  private static getContainerAfter(
    precedingSelector: string,
    id: string
  ): HTMLDivElement {
    const preceding = document.querySelector(precedingSelector)
    const container = LinkedInElements.getContainer(id)
    preceding.parentNode?.insertBefore(container, preceding.nextSibling)
    return container
  }

  private static getContainerInside(
    parentSelector: string,
    id: string
  ): HTMLDivElement {
    const parent = document.querySelector(parentSelector)
    const container = LinkedInElements.getContainer(id)
    parent.appendChild(container)
    return container
  }

  static getReplyButtonContainer(): HTMLDivElement {
    return LinkedInElements.getContainerInside(
      LinkedInElements.Selectors.ReplyButtonContainer,
      'reply-button'
    )
  }

  static getMessageCheckerContainer(): HTMLDivElement {
    return LinkedInElements.getContainerAfter(
      LinkedInElements.Selectors.MessageCheckerPrecedingNode,
      'message-checker'
    )
  }

  static getInvitationsCheckerContainer(): HTMLDivElement {
    return LinkedInElements.getContainerAfter(
      LinkedInElements.Selectors.InvitationsCheckerPrecedingNode,
      'invitation-checker'
    )
  }
}
