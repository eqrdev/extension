const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const dist = resolve(__dirname, '../../dist')

module.exports = {
  mode: 'production',
  entry: {
    content: resolve(__dirname, './src/LinkedIn/index.ts'),
    background: resolve(__dirname, './src/Worker/index.ts'),
    settings: resolve(__dirname, './src/Settings/SettingsComponent.ts'),
    popup: resolve(__dirname, './src/Popup/PopupComponent.ts'),
    components: resolve(__dirname, './src/Shared/Components/index.ts'),
  },
  output: {
    path: resolve(dist, 'js'),
    filename: '[name].min.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 750,
    maxAssetSize: 750,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'template/popup.html',
      filename: resolve(dist, 'html/popup.html'),
      chunks: ['components', 'popup'],
    }),
    new HtmlWebpackPlugin({
      template: 'template/settings.html',
      filename: resolve(dist, 'html/settings.html'),
      chunks: ['components', 'settings'],
      title: 'Equalizer Settings',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: dist },
        { from: 'assets', to: resolve(dist, 'assets') },
        { from: '_locales', to: resolve(dist, '_locales') },
      ],
    }),
  ],
}
