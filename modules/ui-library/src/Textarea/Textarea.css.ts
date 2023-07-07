export default `
<style>
  :host {
    display: flex;
    width: 100%;
    min-width: 600px;
  }
  @media (max-width: 660px) {
    :host {
      min-width: 100%;
    }
  }
  .wrapper {
    width: 100%;
  }
  textarea {
    flex: 1;
    border-radius: 4px;
    border: 1px solid var(--eq-color-n200);
    background: var(--eq-color-white);
    padding: 12px 16px 8px;
    line-height: 20px;
    font-size: 15px;
    font-family: var(--eq-font-primary), sans-serif;
    resize: vertical;
    width: 100%;
    box-sizing: border-box;
  }
  input::placeholder {
    color: var(--eq-color-n200);
  }
  .meta {
    display: flex;
    justify-content: space-between;
    color: var(--eq-color-n300);
  }
</style>`
