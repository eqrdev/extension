import path from 'node:path'
import os from 'node:os'

export class ConfigPath {
  private static DEFAULT_MAC_OS_INSTALL_DIR = path.resolve(
    os.homedir(),
    'Library/Application Support/'
  )

  private static DEFAULT_LAUNCH_AGENT_DIR = path.resolve(
    os.homedir(),
    'Library/LaunchAgents/'
  )

  private static DEFAULT_EQUALIZER_DIRNAME = 'Equalizer'

  private static DEFAULT_LAUNCH_DAEMON_FILENAME =
    'dev.equalizer.autoconnect.plist'

  getFull(filename: string): string {
    return path.resolve(
      ConfigPath.DEFAULT_MAC_OS_INSTALL_DIR,
      ConfigPath.DEFAULT_EQUALIZER_DIRNAME,
      filename
    )
  }

  getLaunchDaemonPath() {
    return path.resolve(
      ConfigPath.DEFAULT_LAUNCH_AGENT_DIR,
      ConfigPath.DEFAULT_LAUNCH_DAEMON_FILENAME
    )
  }
}
