import { Tray as ElectronTray, Menu, app } from 'electron'
import { AssetLocator } from '../../Shared/AssetLocator'
export class Tray {
  constructor(
    private assetLocator: AssetLocator,
    private clickHandler: () => void,
  ) {
    const tray = new ElectronTray(
      this.assetLocator.getPath('equalizerTemplate.png'),
    )

    tray.setContextMenu(
      Menu.buildFromTemplate([
        {
          label: 'Monitoring is running...',
          enabled: false,
        },
        {
          label: 'Open Settings',
          click: () => {
            void app.dock.show()
          },
        },
        { type: 'separator' },
        { role: 'quit', accelerator: 'Cmd+Q' },
      ]),
    )

    tray.addListener('mouse-up', this.clickHandler)
  }
}
