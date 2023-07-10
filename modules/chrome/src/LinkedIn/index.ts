import { createTextInsertButton } from './createTextInsertButton'
import { pasteTextToElement } from './pasteTextToElement'
import { LinkedInPresenter } from './LinnkedInPresenter'
import { DomInjector } from './DomInjector'
import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'

const linkedInPresenter = new LinkedInPresenter()
const button = createTextInsertButton()

linkedInPresenter
  .load(({ isProfileUrlProvided, automaticMessage }) => {
    if (!isProfileUrlProvided) {
      return
    }

    new DomInjector({
      element: button,
      parentSelector: '.msg-form__left-actions',
      routeName: 'Messaging',
      messageType: 'ChangeUrl',
      callback: element => {
        element.addEventListener('click', () => {
          pasteTextToElement(
            automaticMessage,
            document.querySelector('.msg-form__contenteditable')
          )
        })
      },
    })
  })
  .then(async () => {
    await new ChromeMessageGateway().send('Load')
  })
