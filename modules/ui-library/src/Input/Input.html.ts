export interface TemplateProps {
  icon: string
  value: string
  placeholder: string
}

export default ({ icon, value, placeholder }: TemplateProps) => `
<div class="wrapper">
  ${icon ? `<eq-icon type="${icon}"></eq-icon>` : ''}
  <input type="text" value="${value}" placeholder="${placeholder}" />
</div>`
