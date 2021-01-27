import {
  LitElement,
  html,
  property,
  css,
  query,
  internalProperty,
} from 'lit-element';
import { UUIToggleChangeEvent } from '../../../event/UUIToggleChangeEvent';
import {
  uuiHorizontalShakeKeyframes,
  uuiHorizontalShake,
} from '../../../animations/uui-shake';
import { iconWrong, iconCheck } from './toggle-icons';

/**
 *  @element uui-toggle
 */

// TODO -color property
// TODO -size property - how to correctly do it
// TODO -add named icons slots for icons on and off?
// TODO - validation - required option??? does it even make sense? if so what it should output

type LabelPosition = 'left' | 'right' | 'top' | 'bottom';

type ToggleValue = 'on' | 'off'; //should there be more? this is what the form will recieve. it is based on what native checkbox does

export class UUIToggleElement extends LitElement {
  static styles = [
    uuiHorizontalShakeKeyframes,
    css`
      :host {
        --uui-toggle-size: 1.6rem;
        --uui-toggle-switch-width: calc(2 * var(--uui-toggle-size));
        --uui-toggle-grid-gap: calc(var(--uui-toggle-size) / 3);
        --uui-toggle-focus-outline: 0 0 1px 1.5px var(--uui-color-violet-blue);
        font-family: inherit;
        font-size: 1rem;
        display: block;
      }

      label {
        cursor: pointer;
        display: grid;
        grid-template-columns: max-content var(--uui-toggle-switch-width) max-content;
        grid-template-rows: max-content var(--uui-toggle-size) max-content;
        grid-template-areas:
          'top-left top top-right'
          'left center right'
          'bottom-left bottom bottom-right';
        grid-gap: var(--uui-toggle-grid-gap);
      }

      input {
        height: 0px;
        width: 0px;
        position: absolute;
      }

      #slider {
        place-self: stretch;
        transition: all 0.2s ease;
        background: var(--uui-interface-standard-background-color);
        position: relative;
        grid-area: center;
      }

      #icon-container-check,
      #icon-container-wrong {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        /* top: calc(0.1 * var(--uui-toggle-size));
         */
        width: calc(0.6 * var(--uui-toggle-size));
        height: calc(0.6 * var(--uui-toggle-size));
      }

      #icon-container-check {
        left: calc(0.2 * var(--uui-toggle-size));
        fill: var(--uui-color-identity-contrast);
      }

      #icon-container-wrong {
        right: calc(0.2 * var(--uui-toggle-size));
        fill: var(--uui-color-identity);
      }

      label:hover #slider {
        background: var(--uui-interface-standard-background-color-hover);
        box-shadow: 0 0 0px 1px var(--uui-color-grey);
        /* what to set box-shadow to? */
      }

      :host([hide-label]) #label-text {
        height: 0;
        width: 0;
        opacity: 0;
      }

      :host([label-position='left']) #label-text {
        grid-area: left;
        place-self: center;
      }

      :host([label-position='right']) #label-text {
        grid-area: right;
        place-self: center;
      }

      :host([label-position='top']) #label-text {
        grid-area: top;
        place-self: center;
      }

      :host([label-position='bottom']) #label-text {
        grid-area: bottom;
        place-self: center;
      }

      :host([rounded]) #slider {
        border-radius: 100px;
      }

      :host([rounded]) #slider:after {
        border-radius: 100px;
      }

      #slider:after {
        content: '';
        position: absolute;
        top: calc(0.1 * var(--uui-toggle-size));
        left: calc(0.1 * var(--uui-toggle-size));
        width: calc(0.8 * var(--uui-toggle-size));
        height: calc(0.8 * var(--uui-toggle-size));
        background: var(--uui-color-identity-contrast);
        transition: 0.2s ease;
      }

      #slider:before {
        content: '';
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: calc(0.3 * var(--uui-toggle-size));
        font-size: 0.7rem;
        font-weight: bold;
        color: lightgrey;
        filter: brightness(0.5);
      }

      input:checked + #slider {
        background: var(--uui-color-identity);
        /* should that be set to primary? */
      }

      input:checked + #slider:after {
        left: calc(100% - (0.1 * var(--uui-toggle-size)));
        transform: translateX(-100%);
      }

      #slider:active:after {
        width: calc(1.2 * var(--uui-toggle-size));
      }

      :host([disabled]) label {
        filter: brightness(1.15);
      }

      input[disabled] + #slider:active {
        animation: ${uuiHorizontalShake};
      }

      input[disabled] + #slider:active:after {
        width: calc(0.8 * var(--uui-toggle-size));
      }

      input[disabled] + #slider > #icon-container-wrong {
        fill: darkgray;
        /* should probably be var(--uui-color-standard-light) but it */
      }

      input:focus + #slider,
      input:not([disabled]) + #slider:active {
        box-shadow: var(--uui-toggle-focus-outline);
      }
    `,
  ];

  static formAssociated = true;

  private _internals;

  constructor() {
    super();
    this._internals = (this as any).attachInternals();
  }

  @query('#switch')
  protected _input!: HTMLInputElement;

  @internalProperty()
  _value: ToggleValue = 'off';

  @property({ type: String, reflect: true })
  get value(): ToggleValue {
    return this._value;
  }

  set value(newValue: ToggleValue) {
    this._value = newValue;
    this._internals.setFormValue(this._value);
  }

  @property({ type: String })
  label = 'Toggle';

  @property({ type: String, reflect: true })
  name = '';

  @property({ type: Boolean })
  rounded = true;

  @property({ type: String, attribute: 'label-position', reflect: true })
  labelPosition: LabelPosition = 'left';

  @property({ type: Boolean, attribute: 'hide-label' })
  hideLabel = false;

  @property({ type: Boolean, reflect: true })
  checked = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  firstUpdated() {
    if (this.checked) {
      this._input.checked = true;
      this._value = 'on';
    }

    if (this.label && !this.name) {
      this.name = this.label;
    }

    this._input.setAttribute('role', 'switch');
  }

  private _onInputChange() {
    if (this._input.checked) {
      this._value = 'on';
      this.checked = true;
    } else {
      this._value = 'off';
      this.checked = false;
    }

    this.dispatchEvent(new UUIToggleChangeEvent());
  }

  render() {
    return html`
      <label for="switch">
        <input
          type="checkbox"
          id="switch"
          ?disabled="${this.disabled}"
          @change="${this._onInputChange}"
        />
        <div id="slider">
          <div id="icon-container-check">${iconCheck}</div>
          <div id="icon-container-wrong">${iconWrong}</div>
        </div>
        <div id="label-text">${this.label}</div>
      </label>
    `;
  }
}
