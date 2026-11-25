import { sanitizeHtml } from '../functions';
import { toastType } from './toast-service';

/** @typedef {import('types').ThemeColor} ThemeColor */

/**
 * Implements the viewmodel of the toast view.
 * @category toast
 */
export class Toast {
  /** Toast message, sanitized html @type {string} */ message;
  /** Type of toast @type {ThemeColor} */ color;
  /** White text, on the dark backgrounds @type {boolean} */ white;
  /** Urgent message (error, warning), announced at once by the screen readers @type {boolean} */ urgent;

  /**
   * Sets the message and type of the toast.
   * @param {string} message toast message, text or html with formatting tags (b, strong, i, em, br, p, ul, ol, li)
   * @param {ThemeColor} color color of toast
   * @returns {Toast} the current instance
   */
  set(message, color) {
    this.message = sanitizeHtml(message);
    this.color = color;
    this.white = [toastType.error, toastType.success].includes(this.color);
    this.urgent = [toastType.error, toastType.warning].includes(this.color);
    return this;
  }
}
