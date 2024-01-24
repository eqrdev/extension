import styled from '@emotion/styled'

const Styled = {
  Header: styled.header`
    -webkit-app-region: drag;
    height: 52px;
    width: 100%;
    padding-left: 80px;
    box-sizing: border-box;
    align-items: center;
    display: flex;
  `,
  Title: styled.div`
    flex: 1;
    margin: 0 16px;
    font-size: 15px;
    font-weight: bolder;
    color: var(--color-text);
    user-select: none;
  `,
}

export const Header = () => {
  return (
    <Styled.Header>
      <Styled.Title>Equalizer AutoConnect</Styled.Title>
    </Styled.Header>
  )
}
