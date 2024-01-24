import { Logo } from './FirstRun/Logo'
import styled from '@emotion/styled'
import { Layout } from './Layout/Layout'
import { Button } from './MacOSUI/Button'
import { useState } from 'react'
import { Settings } from './Settings/Settings'
import { Logger } from './Logger/Logger'

const Styled = {
  FirstRun: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;
    flex: 1;
  `,
}
export const App = () => {
  const [isFirstRun, setIsFirstRun] = useState(true)

  return (
    <Layout>
      {isFirstRun ? (
        <Styled.FirstRun>
          <Logo />
          <div>Hey awesome dev!</div>
          <Button onClick={() => setIsFirstRun(false)}>
            Let's begin the setup
          </Button>
        </Styled.FirstRun>
      ) : (
        <div>
          <Settings />
        </div>
      )}

      <Logger />
    </Layout>
  )
}
