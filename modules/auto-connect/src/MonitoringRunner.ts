import { Scheduler } from './Scheduler'
import { EqualizerLogger } from './EqualizerLogger'
import { Runner } from './Runner'
import { ConfigPath } from './ConfigPath'
export { FileStorage } from './FileStorage'
export { ConfigPath }

const scheduler = new Scheduler(20000)
const logger = new EqualizerLogger()
const configPath = new ConfigPath()

export type InstallOptions = {
  username: string
  token: string
  message?: string
  openaiKey?: string
}
export async function run(installOptions: InstallOptions) {
  scheduler.schedule(async () => {
    try {
      await Runner.run({
        ...installOptions,
        storagePath: configPath.getFull('checked.json'),
      })
      logger.log('Successful running, waiting for the next schedule')
    } catch (e) {
      logger.log(`Exited with error "${e.message}"`)
    }
  })
}
