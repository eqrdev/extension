export class DOMGateway {
  clickAcceptButtons(senderNames: string[]) {
    const invitationListClass = 'mn-invitation-list'
    const listItemClass = 'invitation-card'
    const cardTitleClass = 'invitation-card__tvm-title'
    const acceptButtonClass = 'artdeco-button--secondary'

    const listItems = document.querySelectorAll(
      `.${invitationListClass} .${listItemClass}`
    )

    listItems.forEach(listItem => {
      const title = listItem.querySelector<HTMLDivElement>(
        `.${cardTitleClass}`
      ).innerText
      if (senderNames.includes(title)) {
        listItem
          .querySelector<HTMLButtonElement>(`.${acceptButtonClass}`)
          .click()
      }
    })
  }

  dispatch<T = Record<string, unknown>>(eventName: string, eventDetail: T) {
    window.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        detail: eventDetail,
      })
    )
  }

  listen(eventName: string, callback) {
    window.addEventListener(eventName, callback)
  }
}
