import plist from 'plist'
import { ConfigPath } from './ConfigPath'
import { FileStorage } from './FileStorage'

export class AutoRunner {
  async install() {
    const configPath = new ConfigPath()
    const fileStorage = new FileStorage(configPath.getLaunchDaemonPath())

    if (await fileStorage.hasFile()) {
      return
    }

    const json = [
      {
        Label: 'dev.equalizer.autoconnect',
        RunAtLoad: true,
        ProgramArguments: ['bash', '-c', '/Users/violapeter/app'],
      },
    ]

    const xml = plist.build(json)
    await fileStorage.save(xml, true)
  }
}
