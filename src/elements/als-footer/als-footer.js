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

  /** Links displayed in the footer. @type {string[]} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  links = [];

  /** Whether the social media links block should be hidden. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  hideSocialMediaLinks = false;

  /** URL of the Facebook page. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  youtubeUrl = 'https://www.youtube.com/@actionlogement';

  /** URL of the Twitter/X page. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  twitterUrl = 'https://x.com/actionlogement';

  /** URL of the LinkedIn page. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.oneTime })
  linkedinUrl = 'https://www.linkedin.com/company/action-logement/mycompany/verification';
}
