export interface TemplateProps {
  classes: string
  icon: string
}

export default ({ icon, classes }: TemplateProps) => `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap">
  <button part="wrapper" class="${classes}">
    ${icon ? `<eq-icon part="icon" type="${icon}"></eq-icon>` : ''}
    <slot></slot>
  </button>`
