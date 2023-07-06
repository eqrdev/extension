import { BaseWebComponent } from '../Shared/BaseWebComponent'
import { PopupPresenter } from './PopupPresenter'

export interface PopupComponentProps {
  profileUrl?: string
  isProfileUrlProvided: boolean
  automaticMessage: string
  isOpenAiEnabled: false
  onClickOptions?: () => void
}

customElements.define(
  'eq-popup',
  class extends BaseWebComponent {
    props: PopupComponentProps = {
      automaticMessage: '',
      isOpenAiEnabled: false,
      isProfileUrlProvided: false,
    }

    static get observedAttributes() {
      return ['isProfileUrlEditing']
    }

    protected async addListeners() {
      const popupPresenter = new PopupPresenter()
      await popupPresenter.load(props => {
        if (JSON.stringify(this.props) === JSON.stringify(props)) {
          return
        }

        this.props = props
        this.render()
      })

      this.$ui.settings.addEventListener('click', this.props.onClickOptions)
    }

    getTemplate() {
      return `
    <style>
      body {
        margin: 0;
        color: var(--eq-color-n500);
        background: var(--eq-color-white);
        font-family: var(--eq-font-primary), sans-serif;
      }
  
      .popup {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        width: 460px;
      }
  
      .popup-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--eq-color-n400);
      }
  
      .popup-title .settings-icons {
        margin: 0 0 0 auto;
      }
  
      .popup-header {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
        align-self: stretch;
        min-height: 21px;
        padding: 12px;
      }
  
      .popup-section {
        border-radius: 4px;
        background: var(--eq-color-n100);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        align-self: stretch;
      }
  
      .popup-section-content {
        padding: 0 12px 12px;
      }
  
      .ai-enabled,
      .ai-disabled {
        color: var(--eq-color-w300);
        text-transform: uppercase;
      }
    </style>
    <div class="popup">
      <div class="popup-title">
        <eq-logo inverse></eq-logo>
        <eq-typo bold>Equalizer</eq-typo>
        <eq-icon-button class="settings-icons" data-js-control="settings" icon="settings"></eq-icon-button>
      </div>
      <section class="popup-section">
        <div class="popup-header">
          <eq-typo bold>${this.__('yourProfileLink')}</eq-typo>
          ${
            this.props.isProfileUrlProvided
              ? `<eq-button icon="content_copy"></eq-button>`
              : ''
          }
        
        </div>
        <div class="popup-section-content">
          ${
            this.props.isProfileUrlProvided
              ? `<eq-typo small class="content">${this.props.profileUrl}</eq-typo>`
              : `<eq-alert severity="error">${this.__('missingUrl')}</eq-alert>`
          }
        </div>
      </section>
      <section class="popup-section">
        <div class="popup-header">
          <eq-typo bold>${this.__('automaticMessage')}</eq-typo>
          <eq-copy-button text="${
            this.props.automaticMessage
          }" copied-message="${this.__('copied')}"></eq-copy-button>
        </div>
        <eq-typo class="popup-section-content content">
          ${this.props.automaticMessage}
        </eq-typo>
      </section>
      <section class="popup-section">
        <div class="popup-header">
          <eq-typo bold>${this.__('openai')}</eq-typo>
          ${
            this.props.isOpenAiEnabled
              ? `<eq-typo small bold class="ai-enabled">${this.__(
                  'enabled'
                )}</eq-typo>`
              : `<eq-typo small bold class="ai-disabled">${this.__(
                  'disabled'
                )}</eq-typo>`
          }
        </div>
      </section>
    </div>
  `
    }
  }
)
