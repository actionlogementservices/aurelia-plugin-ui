import { bindable, bindingMode, customElement } from 'aurelia-framework';

/** @typedef {{ label: string, icon?: string, href?: string, click?: () => void }} AlsUserMenuItem */

/**
 * Implements the **`als-user-menu` custom element** that displays the user's initials and a dropdown of account actions.
 * Each item is a link when `href` is set, otherwise `click` is called.
 * @category element
 */
@customElement('als-user-menu')
export class AlsUserMenu {
  /** Initials of the user displayed in the avatar. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  initials = '';

  /** Label displayed below the avatar. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  label = 'Mon compte';

  /** Menu items, `icon` being a bootstrap-icons class (e.g. `bi-x-circle`). @type {AlsUserMenuItem[]} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  items = [];
}
