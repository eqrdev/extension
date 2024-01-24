import { ReactElement, ReactNode } from 'react'
import { CacheProvider, Global } from '@emotion/react'
import createCache from '@emotion/cache'

const globalStyle = `
:root {
  --sidebarWidth: 180px;
  --gradient-accent: linear-gradient(to top, #b435f8, var(--color-accent));
  --gradient-accent-push: linear-gradient(to top, #b435f8, #a730e7);
  --color-accent: rgb(0, 122, 255);
  --color-accent-active: rgba(0, 122, 255, 0.4);
  --color-accent-push: #a730e7;
  --color-base-background: #fff;
  --color-toolbar-background: #F4F5F5;
  --color-toolbar-button-disabled: #aea5a8;
  --color-toolbar-button: rgba(0, 0, 0, .5);
  --color-toolbar-button-hover: rgba(0, 0, 0, .8);
  --color-label: rgba(0, 0, 0, .26);
  --color-select: rgba(0, 0, 0, .1);
  --color-text: #3d3d3d;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-accent: rgb(10, 132, 255);
    --color-base-background: #1e1e1e;
    --color-toolbar-background: #323232;
    --color-toolbar-button-disabled: #5e5759;
    --color-toolbar-button: rgba(255, 255, 255, .55);
    --color-toolbar-button-hover: rgba(255, 255, 255, .8);
    --color-label: rgba(255, 255, 255, .26);
    --color-select: rgba(255, 255, 255, .1);
    --color-text: #dfdedf;
  }
}

body {
  font-family: sans-serif;
  margin: auto;
  color: var(--color-text);
  font-size: 16px;
  text-rendering: geometricPrecision;
  height: 100vh;
}

#root {
  height: 100vh;
}
`

export const GlobalStyle = ({
  children,
}: {
  children: ReactNode
}): ReactElement => (
  <CacheProvider
    value={createCache({
      key: 'auto-connect',
    })}
  >
    <Global styles={globalStyle} />
    {children}
  </CacheProvider>
)
