import { BaseWebComponent } from '../Shared/BaseWebComponent'
import './SettingsSectionComponent'
import { SettingsPresenter } from './SettingsPresenter'

export interface SettingsComponentProps {
  profileUrl?: string
  profileUrlPart?: string
  isProfileUrlProvided: boolean
  automaticMessage: string
  isOpenAiEnabled: boolean
}

window.customElements.define(
  'eq-settings-page',
  class extends BaseWebComponent {
    private props: SettingsComponentProps = {
      isProfileUrlProvided: false,
      automaticMessage: '',
      isOpenAiEnabled: false,
    }

    protected async addListeners() {
      const settingsPresenter = new SettingsPresenter()
      await settingsPresenter.load(settings => {
        if (JSON.stringify(this.props) === JSON.stringify(settings)) {
          return
        }

        this.props = settings
        this.render()
      })
    }

    getTemplate() {
      return `
      <style>
        .settings {
          display: flex;
          flex-direction: column;
          max-width: 640px;
          margin: 0 auto 72px;
          align-self: stretch;
          gap: 24px;
        }
    
        .settings .logo {
          margin: 24px auto;
        }
        
        .link-editor {
          align-self: stretch;
          align-items: center;
          display: flex;
          width: 100%;
          gap: 8px;
        }
        
        .link-editor eq-input {
          flex: 1;
        }
        
        .settings-detail {
          color: var(--eq-color-n400);
        }
        
        summary {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          list-style: none;
          gap: 4px;
          border-radius: 4px;
        }
        
        summary::-webkit-details-marker {
          display: none;
        }
        
        summary:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(39, 39, 39, 0.4);
        }
        
        .settings-detail eq-icon::part(icon) {
          color: var(--eq-color-n300);
          transition: rotate .3s ease;
        }
        
        .settings-detail[open] eq-icon::part(icon) {
          rotate: 180deg;
        }
        
        .summary {
          display: flex;
          flex-direction: column;
          gap: 48px;
          padding: 24px 0;
        }
        
        .summary-section {
          align-items: center;
          display: flex;
          gap: 24px;
        }
        
        .summary-section.right {
          flex-direction: row-reverse;
        }
        
        .summary .text {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .api-key-editor {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-self: stretch;
          flex: 1;
        }
      </style>
      <div class="settings">
        <eq-logo class="logo" inverse size="40"></eq-logo>
        <eq-header level="2">${this.__('settings')}</eq-header>
        
        <eq-settings-section
          title="${this.__('yourProfileLink')}"
          ${
            this.props.isProfileUrlProvided
              ? `copy="${this.getAttribute('profileUrl')}"`
              : ''
          }
          editable>
          <div slot="content">
            ${
              this.props.isProfileUrlProvided
                ? `<eq-typo>${this.props.profileUrl}</eq-typo>`
                : `<eq-alert severity="error">${this.__(
                    'missingUrlSettingsPage'
                  )}</eq-alert>`
            }
          </div>
          <eq-typo slot="content">${this.props.profileUrl}</eq-typo>
          <div slot="edit" class="link-editor">
            <eq-typo>equalizer.dev/me/</eq-typo>
            <eq-input
              value="${this.props.profileUrl}"
              placeholder="${this.__('yourProfileId')}" />
          </div>
        </eq-settings-section>
        
        <eq-settings-section
          title="${this.__('automaticMessage')}"
          copy="${this.props.automaticMessage}"
          editable>
          <eq-typo slot="content">
            ${this.props.automaticMessage}
          </eq-typo>
          <div slot="edit">
            <eq-textarea
              value="${this.props.automaticMessage}"
              info="${this.__('insertUrlInfo')}"
              maxLength="1000"></eq-textarea>
          </div>
          <details slot="info" class="settings-detail">
            <summary>
              <eq-typo>How does it work?</eq-typo>
              <eq-icon type="keyboard_arrow_down"></eq-icon>
            </summary>
            <div class="summary">
            
              <div class="summary-section">
                <img src="../assets/images/auto-reply.png" alt="${this.__(
                  'autoReply'
                )}">
                <div class="text">
                  <eq-typo bold>${this.__('autoReply')}</eq-typo>
                  <eq-typo>${this.__('autoReplyText')}</eq-typo>
                </div>
              </div>
              <div class="summary-section right">
                <img src="../assets/images/linkedin-message.png" alt="${this.__(
                  'linkedinMessage'
                )}">
                <div class="text">
                  <eq-typo bold>${this.__('linkedinMessage')}</eq-typo>
                  <eq-typo>${this.__('linkedinMessageText')}</eq-typo>
                </div>
              </div>
              <div class="summary-section">
                <img src="../assets/images/extension-features.png" alt="${this.__(
                  'extensionFeatures'
                )}">
                <div class="text">
                  <eq-typo bold>${this.__('extensionFeatures')}</eq-typo>
                  <eq-typo>${this.__('extensionFeaturesText')}</eq-typo>
                </div>
              </div>
            </div>
          </details>
        </eq-settings-section>
        
        <eq-settings-section title="${this.__(
          'openai'
        )}" data-openai switchable>
          <eq-typo slot="content-alway-show">
            ${this.__('openAiDescription')}
          </eq-typo>
          <div class="api-key-editor" slot="edit">
            <eq-typo small bold>${this.__('apiKeyLabel')}</eq-typo>
            <eq-input placeholder="${this.__('apiKeyPlaceholder')}"></eq-input>
          </div>
        </eq-settings-section>
      </div>
    `
    }
  }
)
