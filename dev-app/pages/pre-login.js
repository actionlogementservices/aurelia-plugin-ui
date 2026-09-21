
export class PreLogin {
  innerProperty = 'Some value';
  footerLinks = [
    { text: 'Qui sommes-nous', url: 'https://example.com' },
    { text: 'Contact1', url: 'https://example.com/contact' },
    { text: 'Contact2', url: 'https://example.com/contact' },
    { text: 'Contact3', url: 'https://example.com/contact' },
    { text: 'Contact4', url: 'https://example.com/contact' }
  ];

  /**
   * Callback function to be executed when the "Se Connecter" button is clicked.
   * @type {Function}
   */
  onButtonClick() {
    console.log(`Button clicked - ${this.innerProperty}`);
  }
}
