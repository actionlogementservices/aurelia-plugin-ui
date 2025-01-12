/**
 * Defines the output of the modal dialog.
 * @category dialog
 */
export class DialogResult {
  /**
   * Was the modal dialog cancelled by user?
   * @type {boolean}
   */
  wasCancelled = true;

  /**
   * Output of the modal dialog
   * @type {any}
   */
  output;

  /**
   * Updates the output result of the modal dialog.
   * @param {any} output output of the modal dialog
   * @param {boolean} wasCancelled was the modal dialog cancelled by user?
   */
  update(output, wasCancelled) {
    this.wasCancelled = wasCancelled;
    this.output = output;
  }
}
