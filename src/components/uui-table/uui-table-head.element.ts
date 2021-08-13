import { LitElement, css, html } from 'lit';

/**
 *  @element uui-table-head
 *  @description Table head element. Holds the styles for table head. Parent to <uui-table-head-cell>
 */
export class UUITableHeadElement extends LitElement {
  static styles = [
    css`
      :host {
        display: table-header-group;
        font-weight: bold;
      }
    `,
  ];

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'row');
  }

  render() {
    return html`<slot></slot>`;
  }
}
