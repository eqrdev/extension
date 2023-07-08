import type { ReactElement, ReactNode } from 'react'
import { createContext } from 'react'
import { Global, css } from '@emotion/react'

export const GlobalStyleContext = createContext({})

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto+Mono&display=swap');

:root {
  --eq-font-primary: 'Inter', Arial, sans-serif;
  --eq-font-secondary: 'Roboto Mono', Menlo, Monaco, monospace;
  --eq-color-n500: #272727;
  --eq-color-n400: #595B5C;
  --eq-color-n300: #9A9C9E;
  --eq-color-n200: #D3D5D9;
  --eq-color-n100: #F3F3F3;
  --eq-color-white: #fff;
  --eq-color-s300: #1BA457;
  --eq-color-s200: #7FCCA1;
  --eq-color-s100: #C8E9D7;
  --eq-color-w300: #FE9C36;
  --eq-color-w320: #FEC88E;
  --eq-color-w100: #FFE7CF;
  --eq-color-e300: #EF4127;
  --eq-color-e200: #F69586;
  --eq-color-e100: #FBD1CB;
}

::selection {
  background: var(--eq-color-n400);
  color: var(--eq-color-white);
}
`

export const EqGlobal = ({
  children,
}: {
  children: ReactNode
}): ReactElement => (
  <GlobalStyleContext.Provider value={{}}>
    <Global styles={css(globalStyles)} />
    {children}
  </GlobalStyleContext.Provider>
)
