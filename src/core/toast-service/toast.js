import { toastType } from './toast-service';

/** @typedef {import('types').ThemeColor} ThemeColor */

/**
 * Implements the viewmodel of the toast view.
 * @category toast
 */
export class Toast {
  /** Toast message @type {string} */ message;
  /** Type of toast @type {ThemeColor} */ color;

  /**
   * Sets the message and type of the toast.
   * @param {string} message toast message
   * @param {ThemeColor} color color of toast
   * @returns {Toast} the current instance
   */
  set(message, color) {
    this.message = message;
    this.color = color;
    this.white = [toastType.error, toastType.success].includes(this.color);
    return this;
  }
}
