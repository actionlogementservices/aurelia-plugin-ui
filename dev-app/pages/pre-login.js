
export class PreLogin {
  innerProperty = 'Some value';
  footerLinks = [{ text: 'Test', url: 'https://example.com' }];

  /**
   * Callback function to be executed when the "Se Connecter" button is clicked.
   * @type {Function}
   */
  onButtonClick() {
    console.log(`Button clicked - ${this.innerProperty}`);
  }
}
