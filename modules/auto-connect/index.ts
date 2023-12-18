import { resolve } from 'path'
import { fork } from 'child_process'
import { Scheduler } from './src/Scheduler'
import { EqualizerLogger } from './src/EqualizerLogger'

const scheduler = new Scheduler(20000)
const logger = new EqualizerLogger()

scheduler.schedule(async () => {
  const child = fork(resolve(__dirname + '/src/run.js'))

  child.on('exit', (code, signal) => {
    if (code === 0) {
      logger.log('Successful running, waiting for the next schedule')
      return
    }
    logger.log(
      `Child process exited with code "${code}" and signal "${signal}"`
    )
  })

  child.on('message', logger.log)
})
