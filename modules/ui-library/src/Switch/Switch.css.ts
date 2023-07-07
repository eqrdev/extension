export default `
<style>
  :host {
    outline: 0;
    border-radius: 40px;
  }

  [part="track"] {
    width: 48px;
    height: 24px;
    flex-shrink: 0;
    border-radius: 40px;
    border: 1px solid var(--eq-color-n200);
    background: var(--eq-color-white);
    position: relative;
    transition: background .3s ease;
    outline: 0;
  }
  
  [part="slider"] {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border-radius: 16px;
    background: var(--eq-color-n300);
    position: absolute;
    top: 0;
    left: 0;
    margin: 4px;
    outline: 0;
    transition:
      transform .3s ease,
      background .3s ease;
  }
  
  :host(:focus) {
    box-shadow: 0 0 0 2px rgba(39, 39, 39, 0.4);
  }
  
  :host([checked]) [part="track"] {
    background: var(--eq-color-s300);
  }
  
  :host [part="track"]::before {
    content: attr(label);
    position: absolute;
    right: calc(100% + 8px);
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
  }
  
  :host([checked]) [part="track"]::before {
    content: attr(labelEnabled);
  }
  
  :host([checked]) [part="slider"] {
    background: var(--eq-color-white);
    transform: translateX(24px);
  }
</style>`
