export const typographyCss = `
<style>
  :host > slot {
    font-family: var(--eq-font-primary), sans-serif;
  }
  
  :not(.small) > slot {
    font-size: 15px;
    line-height: 21px;
  }
  
  :not(.bold) > slot {
    font-weight: 400;
  }
  
  .bold > slot {
    font-weight: 700;
  }
  
  .small > slot {
    font-size: 13px;
    line-height: 16px;
  }
  
  .link > slot {
    text-decoration: underline;
  }
</style>`

export const headerCss = `
<style>
  [part="header"] {
    font-family: var(--eq-font-primary), sans-serif;
  }

  .eq-typo-header1 {
    font-size: 34px;
    line-height: 38px;
    font-weight: 700;
  }
  
  .eq-typo-header2 {
    font-size: 28px;
    line-height: 32px;
    font-weight: 700;
  }
  
  .eq-typo-header3 {
    font-size: 24px;
    line-height: 28px;
    font-weight: 700;
  }
  
  .eq-typo-header4 {
    font-size: 20px;
    line-height: 25px;
    font-weight: 700;
  }
</style>`
