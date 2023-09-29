const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const dist = resolve(__dirname, './dist')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    content: resolve(__dirname, './src/LinkedIn/index.tsx'),
    background: resolve(__dirname, './src/Worker/index.ts'),
    settings: resolve(__dirname, './src/Settings/index.tsx'),
    popup: resolve(__dirname, './src/Popup/index.tsx'),
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
        exclude: /node_modules\/(?!ui-library)/,
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
      filename: resolve(dist, 'html/popup.html'),
      chunks: ['popup'],
      templateContent: `
        <link rel="stylesheet" href="../assets/popup.css" />
        <body class="loading">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 -960 960 960">
            <path d="M160-160v-320h140v320H160Zm250 0v-640h140v640H410Zm250 0v-440h140v440H660Z"></path>
          </svg>
          <div id="root"></div>
        </body>
      `,
    }),
    new HtmlWebpackPlugin({
      filename: resolve(dist, 'html/settings.html'),
      chunks: ['settings'],
      title: 'Equalizer Settings',
      templateContent: `
        <link rel="icon" type="image/x-icon" href="../assets/icons/icon-32.png" />
        <title>Equalizer Settings</title>
        <div id="root"></div>`,
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
