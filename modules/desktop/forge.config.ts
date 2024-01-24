import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { MakerRpm } from '@electron-forge/maker-rpm'
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives'
import { WebpackPlugin } from '@electron-forge/plugin-webpack'

import { mainConfig } from './config/webpack.main.config'
import { rendererConfig } from './config/webpack.renderer.config'

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './src/Electron/Assets/icon.icns',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: 'AutoConnect',
      title: 'AutoConnect',
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/Electron/Assets/index.html',
            js: './src/Electron/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/Electron/preload.ts',
            },
          },
        ],
      },
    }),
  ],
}

export default config
