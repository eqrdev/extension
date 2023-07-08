import { HTMLAttributes, ReactElement, useEffect, useState } from 'react'
import styled from '@emotion/styled'

export interface EqSwitchProps {
  label: string
  enabledLabel?: string
  checked: boolean
  onSwitch?: (checked: boolean) => void
}

const Styled = {
  Wrapper: styled.div({
    display: 'flex',
    outline: 0,
    borderRadius: 40,
    gap: 8,
  }),
  Track: styled.div<Pick<EqSwitchProps, 'checked'>>(({ checked }) => ({
    width: 48,
    height: 24,
    flexShrink: 0,
    borderRadius: 40,
    border: '1px solid var(--eq-color-n200)',
    background: checked ? 'var(--eq-color-s300)' : 'var(--eq-color-white)',
    position: 'relative',
    transition: 'background .3s ease',
    outline: 0,

    '&:focus': {
      boxShadow: '0 0 0 2px rgba(39, 39, 39, 0.4)',
    },
  })),
  Slider: styled.div<Pick<EqSwitchProps, 'checked'>>(({ checked }) => ({
    width: 16,
    height: 16,
    flexShrink: 0,
    borderRadius: 16,
    background: checked ? 'var(--eq-color-white)' : 'var(--eq-color-n300)',
    transform: checked ? 'translateX(24px)' : 'translateX(0)',
    position: 'absolute',
    top: 0,
    left: 0,
    margin: 4,
    outline: 0,
    transition: `
      transform .3s ease,
      background .3s ease`,
  })),
  Label: styled.label({
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '24px',
  }),
}

export const EqSwitch = ({
  label,
  checked,
  onSwitch,
  enabledLabel,
}: EqSwitchProps & HTMLAttributes<HTMLInputElement>): ReactElement => {
  const [isChecked, setIsChecked] = useState(checked)

  useEffect(() => {
    setIsChecked(checked)
  }, [checked])

  const handleClick = () => {
    setIsChecked(!isChecked)
    onSwitch?.(!isChecked)
  }

  const handleKeydown = event => {
    if ([' ', 'Enter'].includes(event.key)) {
      event.preventDefault()
      handleClick()
    }
  }

  return (
    <Styled.Wrapper>
      <Styled.Label>
        {isChecked && enabledLabel ? enabledLabel : label}
      </Styled.Label>
      <Styled.Track
        checked={isChecked}
        tabIndex={0}
        role="switch"
        onClick={handleClick}
        onKeyDown={handleKeydown}
      >
        <Styled.Slider checked={isChecked} />
      </Styled.Track>
    </Styled.Wrapper>
  )
}
