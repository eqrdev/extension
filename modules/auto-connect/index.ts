import { Scheduler } from './src/Scheduler'
import { EqualizerLogger } from './src/EqualizerLogger'
import { Runner, RunOptions } from './src/Runner'
import { program } from 'commander'

const scheduler = new Scheduler(20000)
const logger = new EqualizerLogger()

program
  .name('Equalizer AutoConnect')
  .description('Job offer qualifier for sought software engineers')
  .version('1.0.0')
  .option('-u, --username <char>', 'your Equalizer username')
  .option('-m, --message <char>', 'the automatic reply to the scout')
  .option('-t, --token <char>', 'your active LinkedIn session token')
  .option('-o, --openaikey <char>', 'your OpenAI API key')
  .option('--no-headless', 'run puppeteer without headless mode')

program.parse()

const optionsFromEnvironment: RunOptions = {
  username: process.env.LI_PROFILE_ID,
  token: process.env.LI_SESSION_TOKEN,
  message: process.env.LI_AUTO_MESSAGE,
  openaiKey: process.env.OPENAI_API_KEY,
  noHeadlessRun: !!process.env.PUPPETEER_NO_HEADLESS,
  storagePath: '../.storage/equalizer.json',
}

const optionsFromCli = program.opts<RunOptions>()

const options = { ...optionsFromEnvironment, ...optionsFromCli }

scheduler.schedule(async () => {
  try {
    await Runner.run(options)
    logger.log('Successful running, waiting for the next schedule')
  } catch (e) {
    logger.log(`Exited with error "${e.message}"`)
  }
})
