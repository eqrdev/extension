import { mergeRefs } from 'react-merge-refs'
import styled from '@emotion/styled'
import { EqTypo } from './EqTypo'
import {
  ChangeEventHandler,
  forwardRef,
  TextareaHTMLAttributes,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { merge } from '@emotion/css'

export interface EqTextareaProps {
  maxLength?: number
  value?: string
  info?: string
  characterCount?: boolean
}

const Styled = {
  Wrapper: styled.div({
    width: '100%',
  }),
  Textarea: styled.textarea({
    flex: 1,
    borderRadius: 4,
    border: '1px solid var(--eq-color-n200)',
    background: 'var(--eq-color-white)',
    padding: '12px 16px 8px',
    lineHeight: '20px',
    fontSize: 15,
    fontFamily: 'var(--eq-font-primary), sans-serif',
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box',

    '&::placeholder': {
      color: 'var(--eq-color-n200)',
    },
  }),
  Meta: styled.div({
    display: 'flex',
    justifyContent: 'space-between',
    color: 'var(--eq-color-n300)',
    marginTop: 8,
  }),
  Info: styled(EqTypo)({}),
  CharCount: styled(EqTypo)({}),
}

export const EqTextarea = forwardRef<
  HTMLTextAreaElement,
  EqTextareaProps & TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ value, info, maxLength, characterCount, ...props }, ref) => {
  const inputRef = useRef(null)
  const [currentValue, setCurrentValue] = useState(value)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = `${inputRef.current.scrollHeight + 4}px`
    }
  }, [])

  const charCountInfo = useMemo(
    () => `${currentValue.length}/${maxLength}`,
    [currentValue, maxLength]
  )

  const handleInput: ChangeEventHandler<HTMLTextAreaElement> = ({ target }) => {
    setCurrentValue(target.value)
    target.style.height = 'auto'
    target.style.height = `${target.scrollHeight + 4}px`
  }

  return (
    <Styled.Wrapper className="wrapper">
      <Styled.Textarea
        rows={4}
        maxLength={maxLength}
        defaultValue={value}
        onChange={handleInput}
        ref={mergeRefs([inputRef, ref])}
        {...props}
      />
      <Styled.Meta>
        {info && <Styled.Info small>{info}</Styled.Info>}
        {maxLength && characterCount && (
          <Styled.CharCount small>{charCountInfo}</Styled.CharCount>
        )}
      </Styled.Meta>
    </Styled.Wrapper>
  )
})
