export interface TemplateProps {
  label: string
  labelEnabled: string
}

export default ({ label, labelEnabled }: TemplateProps) => `
  <div part="track" label="${label}" labelEnabled="${labelEnabled}">
    <div part="slider"></div>
  </div>`
