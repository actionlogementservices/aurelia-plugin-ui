import { DialogController } from 'core/dialog-service/dialog-controller';
import { inject } from 'aurelia-framework';

@inject(DialogController)
export class ExempleDialog {
  /**
   * @param {DialogController} controller
   */
  constructor(controller) {
    this._controller = controller;
  }

  confirm() {
    this._controller.ok();
  }

  cancel() {
    this._controller.cancel();
  }
}
