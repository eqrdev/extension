import { ReplyButton } from './Messaging/ReplyButton/ReplyButton'
import { MessageChecker } from './Messaging/MessageChecker/MessageChecker'
import { onLoadPage } from './Shared/onLoadPage'

const replyButton = new ReplyButton()
const messageChecker = new MessageChecker()

onLoadPage('Messaging', () => {
  replyButton.inject()
  messageChecker.inject()
})
