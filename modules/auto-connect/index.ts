import { AutoConnect } from './src/AutoConnect'
import { EqualizerLogger } from './src/EqualizerLogger'
import { PersistentStorage } from './src/PersistentStorage'
import { PuppeteerBrowserService } from './src/PuppeteerBrowserService'
import {
  ConversationEvaluator,
  DateEvaluator,
  InvitationEvaluator,
  OpenAIEvaluator,
  ProfileUrl,
} from 'equalizer'
import { PuppeteerLinkedInService } from './src/PuppeteerLinkedInService'
import * as process from 'process'

const persistentStorage = new PersistentStorage(Date)
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
const openAiEvaluator = new OpenAIEvaluator(process.env.OPENAI_API_KEY)
const dateEvaluator = new DateEvaluator(Date)
const invitationEvaluator = new InvitationEvaluator(openAiEvaluator)
const conversationEvaluator = new ConversationEvaluator(
  dateEvaluator,
  openAiEvaluator
)
const linkedInService = new PuppeteerLinkedInService(browserService)
const logger = new EqualizerLogger()

const profileUrl = new ProfileUrl(process.env.LI_PROFILE_ID)
const message = profileUrl.replaceInText(process.env.LI_AUTO_MESSAGE)

const autoConnect = new AutoConnect(
  persistentStorage,
  linkedInService,
  invitationEvaluator,
  conversationEvaluator,
  logger,
  message
)

autoConnect.monitorEnquiries().then()
