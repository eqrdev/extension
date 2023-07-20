import { App as ReplyButtonApp } from './Messaging/ReplyButton/index'
import { App as MessageCheckerApp } from './Messaging/MessageChecker'
import { App as InvitationCheckerApp } from './Invitations/InvitationChecker'
import { LinkedInElements } from './Shared/LinkedInElements'
import { ReactAppLoader } from './Shared/ReactAppLoader'
;(async () => {
  await new ReactAppLoader({
    rootGetter: LinkedInElements.getMessageCheckerContainer,
    routeName: 'Messaging',
    element: <MessageCheckerApp />,
  }).init()

  await new ReactAppLoader({
    rootGetter: LinkedInElements.getReplyButtonContainer,
    routeName: 'Messaging',
    element: <ReplyButtonApp />,
  }).init()

  await new ReactAppLoader({
    rootGetter: LinkedInElements.getInvitationsCheckerContainer,
    routeName: 'MyNetwork',
    element: <InvitationCheckerApp />,
  }).init()
})()
