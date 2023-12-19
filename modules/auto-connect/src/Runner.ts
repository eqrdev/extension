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
import { LinkedInService } from './LinkedInService'
import { AutoConnect } from './AutoConnect'

const fileStorage = new FileStorage<EqualizerStoredData>(
  resolve(__dirname, '../.storage/equalizer.json')
)
const persistentStorage = new PersistentStorage(Date, fileStorage)
const browserService = new PuppeteerBrowserService({
  baseUrl: 'https://www.linkedin.com/',
  cookies: [
    {
      name: 'li_at',
      value: process.env.LI_SESSION_TOKEN,
      domain: '.www.linkedin.com',
    },
  ],
  runInContainer: process.env.PUPPETEER_RUN_IN_DOCKER === 'true',
})
const logger = new EqualizerLogger()
const dateEvaluator = new DateEvaluator(Date)
const linkedInService = new LinkedInService(browserService)

export class Runner {
  static async run() {
    const hasOpenAi = OpenAIEvaluator.isKeyValid(process.env.OPENAI_API_KEY)

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

    if (
      !ConfigurationValidator.isEqualizerProfileNameValid(
        process.env.LI_PROFILE_ID
      )
    ) {
      logger.log(
        "Provided Equalizer profile name is invalid. Monitoring hasn't started."
      )
      return
    }

    const profileUrl = new ProfileUrl(process.env.LI_PROFILE_ID)

    const isMessageValid =
      !!process.env.LI_AUTO_MESSAGE &&
      ConfigurationValidator.isMessageValid(process.env.LI_AUTO_MESSAGE)
    if (!isMessageValid) {
      logger.log(
        'Provided auto message is invalid. We provided a default reply for you.'
      )
    }
    const message = profileUrl.replaceInText(
      isMessageValid ? process.env.LI_AUTO_MESSAGE : DEFAULT_AUTO_REPLY_TEXT
    )

    const openAiEvaluator = hasOpenAi
      ? new OpenAIEvaluator(process.env.OPENAI_API_KEY)
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
