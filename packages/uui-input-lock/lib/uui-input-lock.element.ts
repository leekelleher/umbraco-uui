import { defineElement } from '@umbraco-ui/uui-base/lib/registration';
import { css, html } from 'lit';
import { UUIInputElement } from '@umbraco-ui/uui-input/lib';
import {
  iconLock,
  iconUnlock,
} from '@umbraco-ui/uui-icon-registry-essential/lib/svgs';
import { property } from 'lit/decorators.js';

/**
 * @element uui-input-lock
 * @extends uui-input
 */
@defineElement('uui-input-lock')
export class UUIInputLockElement extends UUIInputElement {
  static styles = [
    ...UUIInputElement.styles,
    css`
      #lock {
        height: 100%;

        --uui-button-padding-top-factor: 0;
        --uui-button-padding-bottom-factor: 0;
        --uui-button-padding-left-factor: 0.75;
        --uui-button-padding-right-factor: 0.75;
        font-size: 12px;
      }

      :host([locked]) #input {
        cursor: not-allowed;
        opacity: 0.5;
      }
    `,
  ];

  /**
   * Determine the inputs locked state.
   * @type {boolean}
   * @attr
   * @default true
   */
  @property({ type: Boolean, reflect: true })
  public locked: boolean = true;

  constructor() {
    super();
    this.readonly = true;
  }

  _onLockToggle() {
    this.readonly = this.locked = !this.locked;
  }

  renderIcon() {
    return this.locked === true
      ? html`<uui-icon name="lock" .fallback=${iconLock.strings[0]}></uui-icon>`
      : html`<uui-icon
          name="unlock"
          .fallback=${iconUnlock.strings[0]}></uui-icon>`;
  }

  renderPrepend() {
    return html`<uui-button
      .disabled=${this.disabled}
      @click=${this._onLockToggle}
      compact
      id="lock">
      ${this.renderIcon()}
    </uui-button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'uui-input-lock': UUIInputLockElement;
  }
}
