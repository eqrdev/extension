import { PersistentStorage } from './PersistentStorage'
import { EqualizerLogger } from './EqualizerLogger'
import {
  ConfigurationValidator,
  ConversationEvaluator,
  DateEvaluator,
  DEFAULT_AUTO_REPLY_TEXT,
  InvitationEvaluator,
  OpenAIEvaluator,
  ProfileUrl,
} from 'equalizer'
import { LinkedInService } from './LinkedInService'
import { AutoConnect } from './AutoConnect'
import { BrowserWindow } from 'electron'

export type RunOptions = {
  username: string
  token: string
  message?: string
  openaiKey?: string
  noHeadlessRun?: boolean
}

export class Runner {
  static async run(options: RunOptions, browserWindow: BrowserWindow) {
    const persistentStorage = new PersistentStorage(Date)
    const logger = new EqualizerLogger(browserWindow)
    const dateEvaluator = new DateEvaluator(Date)
    const linkedInService = new LinkedInService(options.token)
    const hasOpenAi = OpenAIEvaluator.isKeyValid(options.openaiKey)

    if (!(await linkedInService.isUserLoggedIn())) {
      logger.log(
        "We haven't managed to login to your LinkedIn account with the provided session token. Monitoring hasn't started.",
      )
      return
    }

    if (!hasOpenAi) {
      logger.log(
        'OpenAI API key is not valid. We do not evaluate the messages automatically.',
      )
    }

    if (!ConfigurationValidator.isEqualizerProfileNameValid(options.username)) {
      logger.log(
        "Provided Equalizer profile name is invalid. Monitoring hasn't started.",
      )
      throw new Error('Please provide a valid Equalizer profile name')
    }

    const profileUrl = new ProfileUrl(options.username)

    const isMessageValid =
      !!options.message &&
      ConfigurationValidator.isMessageValid(options.message)
    if (!isMessageValid) {
      logger.log(
        'Provided auto message is invalid. We provided a default reply for you.',
      )
    }
    const message = profileUrl.replaceInText(
      isMessageValid ? options.message : DEFAULT_AUTO_REPLY_TEXT,
    )

    const openAiEvaluator = hasOpenAi
      ? new OpenAIEvaluator(options.openaiKey)
      : undefined
    const invitationEvaluator = new InvitationEvaluator(openAiEvaluator)
    const conversationEvaluator = new ConversationEvaluator(
      dateEvaluator,
      openAiEvaluator,
    )

    const autoConnect = new AutoConnect(
      persistentStorage,
      linkedInService,
      invitationEvaluator,
      conversationEvaluator,
      logger,
      message,
    )

    await autoConnect.monitorEnquiries()
  }
}
