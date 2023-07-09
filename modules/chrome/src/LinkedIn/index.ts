import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'
import { createTextInsertButton } from './createTextInsertButton'
import { pasteTextToElement } from './pasteTextToElement'
import { LinkedInPresenter } from './LinnkedInPresenter'

const chromeMessageGateway = new ChromeMessageGateway()
const linkedInPresenter = new LinkedInPresenter()

const installTextInsertButton = async () => {
  await linkedInPresenter.load(({ isProfileUrlProvided, automaticMessage }) => {
    if (!isProfileUrlProvided) {
      return
    }

    const button = createTextInsertButton()
    const wrapper = document.querySelector('.msg-form__left-actions')
    wrapper.appendChild(button)
    button.addEventListener('click', () => {
      pasteTextToElement(
        automaticMessage,
        document.querySelector('.msg-form__contenteditable')
      )
    })
  })
}

chromeMessageGateway.on('ChangeUrl', installTextInsertButton)
chromeMessageGateway.on('Load', installTextInsertButton)
