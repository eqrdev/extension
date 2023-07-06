import { BaseWebComponent } from '../Shared/BaseWebComponent'

customElements.define(
  'eq-settings-section',
  class extends BaseWebComponent {
    static get observedAttributes() {
      return ['editing']
    }

    constructor() {
      super()
      this.attachShadow({ mode: 'open' })
    }

    protected addListeners() {
      const section = this.shadowRoot.querySelector('.settings-section')
      section.querySelector('[data-edit]')?.addEventListener('click', () => {
        section.toggleAttribute('data-editing', true)
        this.focusInput()
      })
      section.querySelector('[data-save]')?.addEventListener('click', () => {
        section.toggleAttribute('data-editing', false)
        this.dispatchEvent(new CustomEvent('setting:save'))
      })
      section
        .querySelector('[data-switch]')
        ?.addEventListener(
          'switch:checked',
          ({ detail: { checked } }: CustomEvent) => {
            section.toggleAttribute('data-editing', checked)
            if (checked) this.focusInput()
          }
        )
    }

    focusInput() {
      this.shadowRoot
        .querySelector<HTMLSlotElement>('#edit')
        .assignedElements({ flatten: true })[0]
        .querySelector<HTMLInputElement>('eq-input, eq-textarea')
        ?.focus()
    }

    getTemplate(): string {
      return `
      <style>
        .settings-section {
          border-radius: 4px;
          background: var(--eq-color-n100);
          display: flex;
          padding: 16px;
          flex-direction: column;
          align-items: stretch;
          gap: 12px;
          align-self: stretch;
          justify-content: stretch;
          position: relative;
        }
    
        .settings-header {
          display: flex;
          align-items: center;
          align-self: stretch;
          justify-content: space-between;
          height: 40px;
        }
        
        .settings-edit {
          display: flex;
        }
    
        .settings-actions {
          display: flex;
          justify-self: stretch;
          gap: 4px;
        }
        
        .settings-content {
          align-self: stretch;
        }
        
        .settings-save {
          display: flex;
          justify-content: flex-end;
        }
        
        /** hidden states */
        
        [data-editing] .settings-content,
        [data-editing] .settings-actions,
        .settings-edit,
        .settings-save {
          visibility: hidden;
          height: 0;
          position: fixed;
          opacity: 0;
        }
        
        [data-editing] .settings-save,
        [data-editing] .settings-edit {
          visibility: visible;
          height: auto;
          position: static;
          opacity: 1;
        }
      </style>
      <div class="settings-section" ${
        this.hasAttribute('editing') ? 'data-editing' : ''
      }>
        <div class="settings-header">
          <eq-typo bold>${this.getAttribute('title')}</eq-typo>
          <div class="settings-actions">
            <slot name="actions"></slot>
            ${
              this.hasAttribute('copy')
                ? `<eq-copy-button text="${this.getAttribute(
                    'copy'
                  )}" copied-message="${this.__('copied')}"></eq-copy-button>`
                : ''
            }
            ${
              this.hasAttribute('editable')
                ? `<eq-icon-button data-edit icon="edit"></eq-icon-button>`
                : ''
            }
          </div>
          ${
            this.hasAttribute('switchable')
              ? `<eq-switch data-switch label="${this.__(
                  'disabled'
                )}" labelEnabled="${this.__('enabled')}"></eq-switch>`
              : ''
          }
        </div>
        <div class="settings-content-alway-show">
          <slot name="content-alway-show"></slot>
        </div>
        <div class="settings-content">
          <slot name="content"></slot>
        </div>
        <div class="settings-edit">
          <slot name="edit" id="edit"></slot>
        </div>
        <div class="settings-save">
          <eq-button icon="save" data-save>${this.__('save')}</eq-button>
        </div>
        <slot name="info"></slot>
      </div>`
    }
  }
)
