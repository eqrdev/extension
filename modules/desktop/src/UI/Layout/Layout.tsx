import { ReactNode } from 'react'
import { Header } from '../FirstRun/Header'
import styled from '@emotion/styled'
import { GlobalStyle } from '../Global/GloabalStyle'

const Styled = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
  `,
  Main: styled.main`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 24px;
    box-sizing: border-box;
  `,
}

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <GlobalStyle>
      <Styled.Wrapper>
        <Header />
        <Styled.Main>{children}</Styled.Main>
      </Styled.Wrapper>
    </GlobalStyle>
  )
}
