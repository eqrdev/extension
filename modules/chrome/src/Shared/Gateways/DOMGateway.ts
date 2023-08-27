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
      console.log(listItem)

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
}
