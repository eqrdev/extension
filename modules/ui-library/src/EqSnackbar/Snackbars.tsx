import styled from '@emotion/styled'
import { Snackbar, SnackbarProps } from './Snackbar'

const Styled = {
  Wrapper: styled.div({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 1111,
  }),
}

export const Snackbars = ({ snackbars }: { snackbars: SnackbarProps[] }) => (
  <Styled.Wrapper>
    {snackbars.map((props, index) => (
      <Snackbar {...props} key={`snackbar-${index}`} />
    ))}
  </Styled.Wrapper>
)
