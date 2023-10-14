import { Logger } from './Types/Logger'

export class EqualizerLogger implements Logger {
  log(message: string): void {
    console.log(`[EQUALIZER] ${message}`)
  }
}
