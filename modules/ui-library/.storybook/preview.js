import { EqGlobal } from '../src/EqGlobal'

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const Providers = (Story, context) => (
  <EqGlobal cacheId="storybook">
    <Story {...context} />
  </EqGlobal>
)

export const decorators = [Providers]
