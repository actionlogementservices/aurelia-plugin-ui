import { DialogController } from 'core/dialog-service/dialog-controller';
import { computedFrom, inject } from 'aurelia-framework';
import { DialogService } from 'core/dialog-service/dialog-service';

@inject(DialogController, DialogService)
export class ExempleDialog {
  /** @type {'modal' | 'offcanvas'} */ selectedDialogMode = 'modal';
  /** @type {'start' | 'end' | 'top' | 'bottom'} */ selectedOffcanvasPosition = 'end';
  /** @type {string} */ dialogStatus = 'Dialog not opened';
  /** @type {boolean} */ dialogFullscreen = false;
  /** @type {boolean} */ dialogLocked = false;

  /**
   * @param {DialogController} controller
   * @param {DialogService} dialog
   */
  constructor(controller, dialog) {
    this._controller = controller;
    this.dialog = dialog;
  }

  confirm() {
    this._controller.ok();
  }

  cancel() {
    this._controller.cancel();
  }

  async showDialog() {
    const { wasCancelled, output } = await this.dialog.open({
      viewModel: ExempleDialog,
      view: this.isDialogModalMode ? './exemple-dialog.html' : './exemple-offcanvas.html',
      mode: this.selectedDialogMode,
      position: this.selectedOffcanvasPosition,
      fullscreen: this.dialogFullscreen,
      locked: this.dialogLocked
    });
    this.dialogStatus = wasCancelled ? 'Dialog cancelled' : 'Dialog validated';
  }

  @computedFrom('selectedDialogMode')
  get isDialogModalMode() {
    return this.selectedDialogMode === 'modal';
  }
}
