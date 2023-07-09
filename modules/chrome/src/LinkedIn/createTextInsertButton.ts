export const createTextInsertButton = () => {
  const button = document.createElement('button')
  const linkedinCSSClasses = [
    'artdeco-button',
    'artdeco-button--circle',
    'artdeco-button--muted',
    'artdeco-button--2',
    'artdeco-button--tertiary',
  ]
  button.classList.add(...linkedinCSSClasses)
  button.innerHTML = `
    <svg width="48" height="48" viewBox="0 -960 960 960">
      <path d="M160-160v-320h140v320H160Zm250 0v-640h140v640H410Zm250 0v-440h140v440H660Z"></path>
    </svg>
  `
  const svg = button.querySelector('svg')
  svg.style.cssText = `
    width: 24px;
    height: 24px;
    fill: currentColor;`

  return button
}
