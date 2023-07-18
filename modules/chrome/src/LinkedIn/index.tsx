import { createRoot } from 'react-dom/client'
import { onLoadPage } from './Shared/onLoadPage'
import { App as ReplyButtonApp } from './Messaging/ReplyButton/index'
import { App as MessageCheckerApp } from './Messaging/MessageChecker'
import { App as InvitationChecker } from './Invitations/InvitationChecker'
import { LinkedInElements } from './Shared/LinkedInElements'

onLoadPage('Messaging', () => {
  createRoot(LinkedInElements.getMessageCheckerContainer()).render(
    <MessageCheckerApp />
  )
  createRoot(LinkedInElements.getReplyButtonContainer()).render(
    <ReplyButtonApp />
  )
})

onLoadPage('MyNetwork', () => {
  createRoot(LinkedInElements.getInvitationsCheckerContainer()).render(
    <InvitationChecker />
  )
})
