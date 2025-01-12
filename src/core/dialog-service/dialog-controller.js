import { inject } from 'aurelia-framework';
import { DialogRenderer } from './dialog-renderer';
import { DialogResult } from './dialog-result';

/**
 * Controls the modal dialog system.
 * @category dialog
 */
@inject(DialogRenderer, DialogResult)
export class DialogController {
  /**
   * Creates an instance of the DialogController class.
   * @param {DialogRenderer} renderer modal dialog renderer
   * @param {DialogResult} result modal dialog result
   */
  constructor(renderer, result) {
    this._renderer = renderer;
    this._result = result;
  }

  /**
   * Confirms input and closes the modal dialog.
   * @param {any | undefined} output output of the modal dialog
   */
  ok(output) {
    this._result.update(output, false);
    this._renderer.hide();
  }

  /**
   * Cancels input and closes the modal dialog.
   * @param {any | undefined} output output of the modal dialog
   */
  cancel(output) {
    this._result.update(output, true);
    this._renderer.hide();
  }
}
