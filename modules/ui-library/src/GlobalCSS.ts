const css = `
<style>
  :root {
    --eq-font-primary: 'Inter', Arial, sans-serif;
    --eq-font-secondary: 'Roboto Mono', Menlo, Monaco, monospace;
    --eq-color-n500: #272727;
    --eq-color-n400: #595B5C;
    --eq-color-n300: #9A9C9E;
    --eq-color-n200: #D3D5D9;
    --eq-color-n100: #F3F3F3;
    --eq-color-white: #fff;
    --eq-color-s300: #1BA457;
    --eq-color-s200: #7FCCA1;
    --eq-color-s100: #C8E9D7;
    --eq-color-w300: #FE9C36;
    --eq-color-w320: #FEC88E;
    --eq-color-w100: #FFE7CF;
    --eq-color-e300: #EF4127;
    --eq-color-e200: #F69586;
    --eq-color-e100: #FBD1CB;
  }
  
  ::selection {
    background: var(--eq-color-n400);
    color: var(--eq-color-white);
  }
</style>
`

const t = document.createElement('template')
t.innerHTML = css
document.head.appendChild(t.content.cloneNode(true))
