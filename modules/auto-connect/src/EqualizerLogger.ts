import { Logger } from './Types/Logger'

export class EqualizerLogger implements Logger {
  log(message: string): void {
    console.log(`[EQUALIZER] ${message}`)
  }

  headline(message: string): void {
    console.log('\x1b[36m\x1b[4m' + message + '\x1b[0m')
  }
}
