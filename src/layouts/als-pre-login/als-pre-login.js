import { bindable, bindingMode, customElement } from 'aurelia-framework';

@customElement('als-pre-login')
export class AlsPreLogin {
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  helpUrl = '#';

  /**
   * Callback function to be executed when the "Se connecter" button is clicked.
   * @type {Function}
   */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onConnectButtonClickUrl;

  /**
   * Callback function to be executed when the "Se Connecter" button is clicked.
   * @type {Function}
   */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onConnectButtonClick;

  constructor() {}

  handleButtonClick() {
    if (typeof this.onConnectButtonClick === 'function' && this.onConnectButtonClick) {
      this.onConnectButtonClick();
    }
  }
}
