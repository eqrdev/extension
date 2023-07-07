export default `
<style>
  [part="wrapper"] {
    height: auto;
    padding: 8px;
    border-radius: 100%;
    background: none;
    transition: background .2s ease;
  }
  
  [part="wrapper"]:hover {
    background: rgba(0, 0, 0, .1);
  }
  
  [part="wrapper"]:active {
    background: rgba(0, 0, 0, .3);
  }

  [part="icon"] {
    display: flex;
    width: 24px;
    color: var(--eq-color-n400);
  }
</style>`
