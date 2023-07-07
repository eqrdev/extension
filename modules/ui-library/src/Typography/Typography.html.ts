export interface HeaderTemplateProps {
  level: number
}

export interface TypoTemplateProps {
  tag: string
  classes: string
}

export const getHeaderTemplate = ({ level }) => `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700">
  <h${level} part="header" class="eq-typo-header${level}">
    <slot></slot>
  </h${level}>`

export const getTypoTemplate = ({ tag, classes }: TypoTemplateProps) => `
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700">
  <${tag} part="tag" class="${classes}">
    <slot></slot>
  </${tag}>`
