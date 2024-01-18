import { ConsoleIO } from './ConsoleIO'
import { InstallOptionsInquirer } from './InstallOptionsInquirer'
import { AutoRunner } from './AutoRunner'
import { ConfigPath } from './ConfigPath'
import { FileStorage } from './FileStorage'
import { run } from './MonitoringRunner'

type InstallOptions = {
  username: string
  token: string
  message?: string
  openaiKey?: string
}

export class InstallRunner {
  static async run() {
    const consoleIO = new ConsoleIO()
    const configPath = new ConfigPath()
    const fileStorage = new FileStorage<InstallOptions>(
      configPath.getFull('config.json')
    )
    const installer = new InstallOptionsInquirer()
    const autoRunner = new AutoRunner()

    consoleIO.headline('Equalizer AutoConnect 1.0.0')

    consoleIO.write(
      '⊜ Welcome to Equalizer AutoConnect \nPress [Enter] to continue...'
    )

    await consoleIO.waitForKey(10)

    if (!(await fileStorage.hasFile())) {
      const installationData = await installer.prompt()
      await fileStorage.save(installationData)
    }

    await autoRunner.install()

    const options = await fileStorage.read()

    await run(options)
  }
}
