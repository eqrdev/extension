const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const dist = resolve(__dirname, '../../dist')

module.exports = {
  mode: 'production',
  entry: {
    content: resolve(__dirname, './src/content/index.ts'),
    background: resolve(__dirname, './src/background/index.ts'),
    options: resolve(__dirname, './src/options/index.ts'),
    popup: resolve(__dirname, './src/popup/index.ts'),
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
      favicon: 'assets/icons/icon-32.png',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: 'template/options.html',
      filename: resolve(dist, 'html/options.html'),
      favicon: 'assets/icons/icon-32.png',
      chunks: ['options'],
      title: 'Settings',
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
