import { EnquiryMonitor } from './EnquiryMonitor'
import { Browser } from 'puppeteer-core'
import { Logger } from './Logger'

export type RunOptions = {
  username: string
  token: string
  message?: string
  openaiKey?: string
}

export class Runner {
  static async run(options: RunOptions, browser: Browser, logger: Logger) {
    const monitor = new EnquiryMonitor(
      Date,
      logger,
      localStorage,
      browser,
      options.username,
      options.token,
      options.message,
      options.openaiKey,
    )

    await monitor.run()
  }
}
