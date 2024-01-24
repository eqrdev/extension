import { Tray as ElectronTray, Menu, app, nativeImage } from 'electron'
import { TAssetLocator } from '../../Shared/AssetLocator'
export class Tray {
  constructor(
    private assetLocator: TAssetLocator,
    private onOpen: () => void,
  ) {
    const tray = new ElectronTray(
      nativeImage.createFromPath(
        this.assetLocator.getPath('equalizerTemplate.png'),
      ),
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
            this.onOpen()
            void app.dock.show()
          },
        },
        { type: 'separator' },
        { role: 'quit', accelerator: 'Cmd+Q' },
      ]),
    )
  }
}
