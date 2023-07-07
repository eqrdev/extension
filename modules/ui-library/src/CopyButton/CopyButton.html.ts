export interface TemplateProps {
  copiedMessage: string
}

export default ({ copiedMessage }: TemplateProps) => `
  <eq-icon-button part="button" icon="content_copy">
    <span part="copied">
      <eq-icon size="16" type="check_circle_outline"></eq-icon>
      <span>${copiedMessage}</span>
    </span>
  </eq-icon-button>`
