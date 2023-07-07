export interface TemplateProps {
  severity: string
  icon: string
  closable: boolean
}

export default ({ severity, icon, closable }: TemplateProps) => `
<div class="wrapper ${severity}">
  <eq-icon type="${icon}"></eq-icon>
  <div class="content">
    <slot></slot>
  </div>
  ${closable ? '<eq-icon type="close"></eq-icon>' : ''}
</div>
`
