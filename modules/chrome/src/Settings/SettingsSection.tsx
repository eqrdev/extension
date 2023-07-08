import {
  EqAlert,
  EqButton,
  EqCopyButton,
  EqIconButton,
  EqSwitch,
  EqTypo,
} from 'ui-library'
import styled from '@emotion/styled'
import { ReactElement, ReactNode, useContext } from 'react'
import { I18nContext } from '../Shared/I18nProvider'

export interface SettingSectionProps {
  title: string
  copy?: string
  editable?: boolean
  editing: boolean
  switchable?: boolean
  switched?: boolean
  children: ReactNode
  footer?: ReactNode
  error?: string
  onEdit?: () => void
  onSave?: () => void
  onSwitch?: (checked: boolean) => void
}

const Styled = {
  Wrapper: styled.section({
    borderRadius: 4,
    background: 'var(--eq-color-n100)',
    display: 'flex',
    padding: 16,
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
    alignSelf: 'stretch',
    justifyContent: 'stretch',
    position: 'relative',
  }),
  Header: styled.header({
    display: 'flex',
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    height: 40,
  }),
  Actions: styled.div({
    display: 'flex',
    justifySelf: 'stretch',
    gap: 4,
  }),
  SaveButton: styled(EqButton)({
    alignSelf: 'flex-end',
  }),
}

export const SettingsSection = ({
  title,
  copy,
  editable,
  switchable,
  switched,
  children,
  onEdit,
  onSave,
  onSwitch,
  error,
  footer,
  editing = false,
}: SettingSectionProps): ReactElement => {
  const { $i18n } = useContext(I18nContext)

  return (
    <Styled.Wrapper>
      <Styled.Header>
        <EqTypo bold>{title}</EqTypo>
        <Styled.Actions>
          {copy && <EqCopyButton text={copy} copiedMessage={$i18n('copied')} />}
          {editable && <EqIconButton icon="edit" onClick={onEdit} />}
        </Styled.Actions>
        {switchable && (
          <EqSwitch
            checked={switched}
            enabledLabel={$i18n('enabled')}
            label={$i18n('disabled')}
            onSwitch={onSwitch}
          />
        )}
      </Styled.Header>
      {children}
      {error && <EqAlert severity="error">{error}</EqAlert>}
      {editing && (
        <Styled.SaveButton onClick={onSave} icon="save">
          {$i18n('save')}
        </Styled.SaveButton>
      )}
      {footer}
    </Styled.Wrapper>
  )
}
