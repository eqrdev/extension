import { LinkedInUrl } from './Shared/LinkedInUrl'
import { waitForLinkedinLoad } from './Shared/waitForLinkedin'
import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'
import { ReplyButton } from './Messaging/ReplyButton/ReplyButton'
import { MessageChecker } from './Messaging/MessageChecker/MessageChecker'

const linkedInUrl = new LinkedInUrl()
const isOnMessagingPage = () => linkedInUrl.isOnRoute('Messaging')
const replyButton = new ReplyButton()
const messageChecker = new MessageChecker()

const inject = () => {
  replyButton.inject()
  messageChecker.inject()
}

if (isOnMessagingPage()) {
  waitForLinkedinLoad().then(() => {
    inject()
  })
}

const handleChangeUrl = () => {
  if (!isOnMessagingPage()) {
    return
  }

  inject()
}

new ChromeMessageGateway().on('ChangeUrl', handleChangeUrl)
