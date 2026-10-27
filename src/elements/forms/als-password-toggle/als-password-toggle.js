import { containerless, useView } from 'aurelia-framework';

/**
 * Implements the **`als-password-toggle` custom element**: a button masking or revealing the password input
 * located in the same parent, typically placed after the input inside an `als-field`.
 * @category forms
 * @example
 * <als-field label="Mot de passe">
 *   <input type="password" class="form-control" autocomplete="current-password" value.bind="password & validate" />
 *   <als-password-toggle></als-password-toggle>
 * </als-field>
 */
@containerless()
@useView('./als-password-toggle.html')
export class AlsPasswordToggle {
  /** Whether the password is currently revealed. @type {boolean} */
  visible = false;

  /** Html toggle button. @type {HTMLButtonElement} */ button;

  /**
   * Masks or reveals the password.
   */
  toggle() {
    this.visible = !this.visible;
    const input = this.button.parentElement.querySelector('input');
    input.type = this.visible ? 'text' : 'password';
  }
}
