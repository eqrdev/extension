import { FileStorage } from './FileStorage'
import { EqualizerStoredData } from './Types/EqualizerStoredData'
import { resolve } from 'path'
import { PersistentStorage } from './PersistentStorage'
import { PuppeteerBrowserService } from './PuppeteerBrowserService'
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
import { LinkedInService } from './LinkedInService.js'
import { AutoConnect } from './AutoConnect.js'

export type RunOptions = {
  username: string
  token: string
  message?: string
  openaiKey?: string
  noHeadlessRun?: boolean
  storagePath: string
}

export class Runner {
  static async run(options: RunOptions) {
    const fileStorage = new FileStorage<EqualizerStoredData>(
      resolve(options.storagePath)
    )
    const persistentStorage = new PersistentStorage(Date, fileStorage)
    const browserService = new PuppeteerBrowserService({
      baseUrl: 'https://www.linkedin.com/',
      cookies: [
        {
          name: 'li_at',
          value: options.token,
          domain: '.www.linkedin.com',
        },
      ],
      noHeadlessRun: options.noHeadlessRun,
    })
    const logger = new EqualizerLogger()
    const dateEvaluator = new DateEvaluator(Date)
    const linkedInService = new LinkedInService(browserService)
    const hasOpenAi = OpenAIEvaluator.isKeyValid(options.openaiKey)

    if (!(await linkedInService.isUserLoggedIn())) {
      logger.log(
        "We haven't managed to login to your LinkedIn account with the provided session token. Monitoring hasn't started."
      )
      return
    }

    if (!hasOpenAi) {
      logger.log(
        'OpenAI API key is not valid. We do not evaluate the messages automatically.'
      )
    }

    if (!ConfigurationValidator.isEqualizerProfileNameValid(options.username)) {
      logger.log(
        "Provided Equalizer profile name is invalid. Monitoring hasn't started."
      )
      throw new Error('Please provide a valid Equalizer profile name')
    }

    const profileUrl = new ProfileUrl(options.username)

    const isMessageValid =
      !!options.message &&
      ConfigurationValidator.isMessageValid(options.message)
    if (!isMessageValid) {
      logger.log(
        'Provided auto message is invalid. We provided a default reply for you.'
      )
    }
    const message = profileUrl.replaceInText(
      isMessageValid ? options.message : DEFAULT_AUTO_REPLY_TEXT
    )

    const openAiEvaluator = hasOpenAi
      ? new OpenAIEvaluator(options.openaiKey)
      : undefined
    const invitationEvaluator = new InvitationEvaluator(openAiEvaluator)
    const conversationEvaluator = new ConversationEvaluator(
      dateEvaluator,
      openAiEvaluator
    )

    const autoConnect = new AutoConnect(
      persistentStorage,
      linkedInService,
      invitationEvaluator,
      conversationEvaluator,
      logger,
      message
    )

    await autoConnect.monitorEnquiries()
  }
}
