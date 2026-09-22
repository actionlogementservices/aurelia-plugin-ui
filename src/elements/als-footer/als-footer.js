import { bindable, bindingMode, customElement } from 'aurelia-framework';

/**
 * Implements the **`als-footer` custom element** that displays a generic footer with a list of links.
 * @category element
 */
@customElement('als-footer')
export class AlsFooter {
  /** The type of footer to display. @type {'default'|'compact'} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  type = 'default';

  /** URL for the logo link. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  logoUrl = 'https://www.actionlogement.fr/entreprise';

  /** Text for the accessibility conformity link. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  accessibilityText = 'Accessibilité : non conforme';

  /** URL for the accessibility conformity link. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  accessibilityUrl = 'https://www.actionlogement.fr/schema-pluriannuel-accessibilite-numerique';

  /** Links displayed in the footer. @type {Array<{ text: string, url: string }>} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  links = [];

  /** Whether the social media links block should be hidden. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  hideSocialMediaLinks = false;

  /** URL of the YouTube page. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  youtubeUrl = 'https://www.youtube.com/@actionlogement';

  /** URL of the Twitter/X page. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  twitterUrl = 'https://x.com/actionlogement';

  /** URL of the LinkedIn page. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  linkedinUrl = 'https://www.linkedin.com/company/action-logement/mycompany/verification';

  /**
   * Builds an accessible label for links that open in a new tab.
   * @param {string} label The visible text for the link.
   * @returns {string} A screen-reader-friendly label.
   */
  getExternalLinkLabel(label) {
    return label ? `${label.trim()} (ouvre dans un nouvel onglet)` : 'Ouvre dans un nouvel onglet';
  }
}
