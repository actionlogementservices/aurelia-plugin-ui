import { inject } from 'aurelia-framework';
import { DialogRenderer } from './dialog-renderer';
import { DialogResult } from './dialog-result';

/**
 * Controls the dialog system.
 * @category dialog
 */
@inject(DialogRenderer, DialogResult)
export class DialogController {
  /**
   * Creates an instance of the DialogController class.
   * @param {DialogRenderer} renderer dialog renderer
   * @param {DialogResult} result dialog result
   */
  constructor(renderer, result) {
    this._renderer = renderer;
    this._result = result;
  }

  /**
   * Confirms input and closes the dialog.
   * @param {any | undefined} output output of the dialog
   */
  ok(output) {
    this._result.update(output, false);
    this._renderer.hide();
  }

  /**
   * Cancels input and closes the dialog.
   * @param {any | undefined} output output of the dialog
   */
  cancel(output) {
    this._result.update(output, true);
    this._renderer.hide();
  }
}
