export default `
<style>
  [part="button"] {
    position: relative;
  }

  [part="copied"] {
    opacity: 0;
    visibility: hidden;
    translate: 16px 0;
    pointer-events: none;
    display: flex;
    padding: 4px 6px;
    align-items: center;
    gap: 4px;
    border-radius: 4px;
    background: var(--eq-color-s300);
    color: var(--eq-color-white);
    font-size: 13px;
    font-family: var(--eq-font-primary), sans-serif;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    position: absolute;
    right: calc(100% + 4px);
    transition:
      visibility .1s ease,
      translate .1s ease,
      opacity .1s ease;
  }
  
  [part="copied"] eq-icon {
    display: flex;
  }
  
  [part="copied"][data-visible] {
    opacity: 1;
    visibility: visible;
    translate: 0 0;
  }
</style>`
