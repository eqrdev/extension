import { Scheduler } from './src/Scheduler'
import { EnquiryMonitor } from './src/EnquiryMonitor'
import { DateProvider } from 'equalizer'
import { Logger } from './src/Logger'
import { Browser } from 'puppeteer-core'
import { AutoConnectConfig } from './src/EnquiryMonitor'
import { PersistentStorage } from './src/PersistentStorage'
import { MonitoringData } from './src/MonitoringStorage'

export { PersistentStorage } from './src/PersistentStorage'
export { AutoConnectConfig, MonitoringData, Logger }
export function startAutoConnect({
  dateProvider,
  logger,
  storage,
  browser,
  config,
}: {
  dateProvider: DateProvider
  logger: Logger
  storage: PersistentStorage<MonitoringData>
  browser: Browser
  config: AutoConnectConfig
}) {
  const monitor = new EnquiryMonitor(
    dateProvider,
    logger,
    storage,
    browser,
    config,
  )
  const scheduler = new Scheduler(20000, logger)
  scheduler.schedule(async () => {
    await monitor.run()
  })
}
