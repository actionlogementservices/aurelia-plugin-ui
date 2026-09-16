import { bindable, bindingMode, customElement } from 'aurelia-framework';

@customElement('als-pre-login')
export class AlsPreLogin {
  /**
   * URL of the help page.
   * @type {string}
   */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  helpUrl = '#';

  /**
   * Footer links.
   * @type {Array<string>}
   */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  footerLinks = [];

  /**
   * Footer type.
   * @type {'default'|'compact'}
   */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  footerType = 'compact';

  /**
   * Callback function to be executed when the "Se Connecter" button is clicked.
   * @type {Function}
   */
  @bindable({ defaultBindingMode: bindingMode.toView })
  onConnectButtonClick;

  constructor() {}

  /**
   * Handles the click event of the "Se Connecter" button.
   */
  handleButtonClick() {
    if (typeof this.onConnectButtonClick === 'function' && this.onConnectButtonClick) {
      this.onConnectButtonClick();
    }
  }
}
