import { LinkedInUrl } from './Shared/LinkedInUrl'
import { waitForLinkedinLoad } from './Shared/waitForLinkedin'
import { ChromeMessageGateway } from '../Shared/ChromeMessageGateway'
import { ReplyButton } from './Messaging/ReplyButton/ReplyButton'
import { MessageChecker } from './Messaging/MessageChecker/MessageChecker'

const isOnMessagingPage = () => LinkedInUrl.isOnRoute('Messaging')
const replyButton = new ReplyButton()
const messageChecker = new MessageChecker()
const messageGateway = new ChromeMessageGateway()

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

messageGateway.on('NavigateToMessaging', handleChangeUrl)

// messageGateway.on('LinkedInApiCall', ({ csrfToken, pageInstanceHeader }) => {
//   sessionStorage.setItem('linkedInCsrfToken', csrfToken)
//   sessionStorage.setItem('linkedInPageInstanceHeader', pageInstanceHeader)
// })
