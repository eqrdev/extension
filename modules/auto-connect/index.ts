import { resolve } from 'path'
import { AutoConnect } from './src/AutoConnect'
import { EqualizerLogger } from './src/EqualizerLogger'
import { PersistentStorage } from './src/PersistentStorage'
import { PuppeteerBrowserService } from './src/PuppeteerBrowserService'
import {
  ConfigurationValidator,
  ConversationEvaluator,
  DateEvaluator,
  InvitationEvaluator,
  OpenAIEvaluator,
  ProfileUrl,
  DEFAULT_AUTO_REPLY_TEXT,
} from 'equalizer'
import { LinkedInService } from './src/LinkedInService'
import * as process from 'process'
import { FileStorage } from './src/FileStorage'
import { EqualizerStoredData } from './src/Types/EqualizerStoredData'

const fileStorage = new FileStorage<EqualizerStoredData>(
  resolve(__dirname, './.storage/equalizer.json')
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

;(async () => {
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

  const isMessageValid = ConfigurationValidator.isMessageValid(
    process.env.LI_AUTO_MESSAGE
  )
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
})()
