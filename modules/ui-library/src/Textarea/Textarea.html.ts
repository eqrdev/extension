export interface TemplateProps {
  maxLength: number
  value: string
  info: string
  characterCount: string
}

export default ({ maxLength, value, info, characterCount }: TemplateProps) => `
<div class="wrapper">
  <textarea
    rows="4"
    maxlength="${maxLength}">${value}</textarea>
  <div class="meta">
    <eq-typo small class="url-info">${info}</eq-typo>
    <eq-typo small class="character-counter">${characterCount}</eq-typo>
  </div>
</div>`
