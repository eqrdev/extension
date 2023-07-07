export default `
<style>
  .button {
    border: 0;
    border-radius: 4px;
    font-family: var(--eq-font-secondary), sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    white-space: nowrap;
    outline: 0;
    gap: 12px;
    transition:
      background .2s ease,
      box-shadow .2s ease;
  }
  
  .style-default {
    background: var(--eq-color-n500);
    color: var(--eq-color-white);
  }
  
  .style-default:hover {
    background: var(--eq-color-n400);
  }
  
  .style-default:active {
    background: rgba(39, 39, 39, 0.80);
  }
  
  .button:focus {
    box-shadow: 0 0 0 2px rgba(39, 39, 39, 0.4);
  }
  
  .size-default {
    height: 48px;
    padding: 9px 16px;
  }
  
  .large {
    height: 56px;
    padding: 16px 24px;
  }
  
  .small {
    height: 32px;
    padding: 7px 12px;
  }
  
  .outline {
    background: var(--eq-color-white);
    box-shadow: inset 0 0 2px 0 var(--eq-color-n500);
  }
  
  .outline:hover {
    background: var(--eq-color-n200);
  }
  
  .outline:active {
    background: var(--eq-color-n500);
  }
  
  .button:disabled {
    background: var(--eq-color-n200);
    color: var(--eq-color-n300);
  }
  
  .icon-only {
    border-radius: 100%;
    height: 48px;
    width: 48px;
    padding: 4px;
    box-sizing: border-box;
  }
  
  [part="icon"] {
    line-height: 24px;
    height: 24px;
  }
</style>`
