<p align="center">
  <a href="https://equalizer.dev/">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/10433384/254391392-8fb55c77-8212-4f7b-8fc8-2debe9a83a48.png">
      <img src="https://user-images.githubusercontent.com/10433384/254391724-cddee5fb-cca8-4c50-9501-3dbfe435f49e.png" alt="Equalizer" width="200" />
    </picture>
  </a>
</p>

<p align="center">Job offer qualifier for sought software engineers</p>

Hello and welcome to the Equalizer team! We are committed to bring balance to the Force by empowering you to make
the right career choices!

In this repository you can find resources to download, build and install it manually, or you can just simply
use our [Chrome extension.][chrome-extension]

## Usage

If you want to build it yourself or modify the extension, you can do it easily. All you have to do is run the build command (`yarn build`). This creates a directory called `dist` in the root of the repository.

Open the [Extensions][chrome-page] page in Chrome and set the developer mode. Then click the "Load unpacked" button and browse to the `dist` directory.

## Development

Let's begin with structure and architecture of the project. 

We use Yarn 3 as package manager and workspaces to get organized. Structure overview:

```
.
├── ...
├── modules         
│   ├── chrome         # The Chrome extensions source code
│   ├── eslint         # Eslint package and related dependecies, eslint configuration
│   ├── linkedin       # LinkedIn Client, tools and utilities to communicate with LinkedIn
│   ├── openai         # A simple API request to analyze LinkedIn conversations with OpenAI's GPT
│   ├── tests          # Test configuration. There are'nt any test suites here. We use colocation
│   └── ui-library     # React components to build the UI of the extension 
├── package.json       # We do not hold dependencies here.
└── ...
```

Note, that we commit the `.yarn/cache` folder, which contains all the dependencies, and we use 
[Yarn Plug'n'Play,][yarn-pnp] so basically you don't need to run install after you cloned the
repository. 

## License

[MIT](https://github.com/eqrdev/extension/blob/master/LICENSE)

[chrome-extension]: https://equalizer.dev/
[chrome-page]: chrome://extensions/
[yarn-pnp]: https://yarnpkg.com/features/pnp

