export interface TemplateProps {
  size: string
  inverse: boolean
}

export default ({ inverse }: TemplateProps) =>
  `<eq-icon part="icon" type="equalizer" ${
    inverse ? 'data-inverse' : ''
  }></eq-icon>`
