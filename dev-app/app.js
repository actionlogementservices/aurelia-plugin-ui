import { computedFrom, inject, NewInstance } from 'aurelia-framework';
import { faker } from '@faker-js/faker';
import { Validator, ValidationControllerFactory } from 'aurelia-validation';

import { ExempleDialog } from './dialogs/exemple-dialog';
import { AutoCompleteController } from 'resources/elements/auto-complete/auto-complete-controller';
import { LockService } from 'core/lock-service/lock-service';
import { ToastService } from 'core/toast-service/toast-service';
import { DialogService } from 'core/dialog-service/dialog-service';
import { Adresse } from 'resources/elements/auto-complete/adresse';

export const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

/** @typedef {{ disabled: boolean, id: number, name: string; headcount: number, headcountMinusOne: number, email: string; color: string }} Item */

@inject(
  NewInstance.of(AutoCompleteController),
  ToastService,
  LockService,
  DialogService,
  Validator,
  ValidationControllerFactory
)
export class App {

  now = new Date();
  mindate = new Date();
  maxDate = new Date();

  /** @type {AutoCompleteController<Item> } */ controller;
  /** @type {Item[]} */ itemsList;
  /** @type {Item[]} */ smallItemsList;
  /** @type {Item[]} */ selectedItems;
  /** @type {Item} */ selectedItem;
  /** @type {string} */ selectedDate = new Date().toISOString();
  /** @type {any} */ selectedAdresse;
  /** @type {'modal' | 'offcanvas'} */ selectedDialogMode = 'modal';
  /** @type {'start' | 'end' | 'top' | 'bottom'} */ selectedOffcanvasPosition = 'end';
  /** @type {string} */ dialogStatus = 'Dialog not opened';
  /** @type {boolean} */ dialogFullscreen = false;
  /** @type {boolean} */ dialogLocked = false;

  /**
   * @param {AutoCompleteController} controller
   * @param {ToastService} toast
   * @param {LockService} lock
   * @param {DialogService} dialog
   */
  constructor(controller, toast, lock, dialog) {
    this.maxDate.setMonth(this.maxDate.getMonth() + 1);
    this.mindate.setMonth(this.mindate.getMonth() - 1);
    this.maxDateString = this.maxDate.toISOString();
    this.mindateString = this.mindate.toISOString();

    this.environment = { name: 'LOCAL', type: 'dev' };
    this.itemsController = controller;
    this.toast = toast;
    this.lock = lock;
    this.dialog = dialog;
    const itemsList = [];
    for (let index = 0; index < 120; index++) {
      const disabled = Math.random() < 0.5;
      const id = index;
      const name = faker.person.fullName();
      const headcount = Math.round(Math.random()*100)
      const headcountMinusOne = headcount - Math.round(Math.random()*(headcount - 1))
      const email = faker.internet.email();
      const color = faker.color.human();
      itemsList.push({ disabled, id, name, headcount, headcountMinusOne, email, color, showItemDetails: item => this.showItemDetails(item) });
    }
    setTimeout(() => {
      this.itemsList = itemsList;
      this.smallItemsList = itemsList.slice(0, 20);
    }, 500);
  }

  activate() {
    // this.itemsController.configure(
    //   text => this.itemsList.filter(item => item.name.toUpperCase().includes(text.toUpperCase())),
    //   undefined,
    //   values => this.itemsList.filter(item => values.includes(item.id))
    // );
    this.itemsController.configure(
      async text => {
        await wait(200);
        return this.itemsList.filter(item => item.name.toUpperCase().includes(text.toUpperCase()));
      },
      undefined,
      async values => {
        await wait(200);
        return this.itemsList.filter(item => values.includes(item.id));
      }
    );
  }

  async lockScreen() {
    this.lock.lock();
    await wait(1000).finally(() => this.lock.unlock());
  }

  setSelectedItem() {
    this.selectedItem = this.smallItemsList[1];
  }

  setSelectedItems() {
    this.selectedItems = [this.smallItemsList[2], this.smallItemsList[3]];
  }

  setSelectedValue() {
    this.selectedValue = 4;
  }

  setSelectedValues() {
    this.selectedValues = [5, 6, 7];
  }

  resetAll() {
    this.selectedItem = undefined;
    this.selectedValue = undefined;
    this.selectedItems = [];
    this.selectedValues = [];
    this.selectedAdresse = undefined;
  }

  resetSelectedItem() {
    this.selectedItem = undefined;
  }

  resetSelectedItems() {
    this.selectedItems = [];
  }

  resetSelectedValue() {
    this.selectedValue = undefined;
  }

  resetSelectedValues() {
    this.selectedValues = [];
  }

  setSelectedAddress() {
    this.selectedAdresse = Adresse.fromObject({
      numero: '100',
      nomVoie: 'Avenue des Champs Elysées',
      codePostal: '75008',
      commune: 'Paris'
    });
  }

  showInfo() {
    this.toast.info('Info!');
  }

  showWarning() {
    this.toast.warning('Warning!');
  }

  showError() {
    this.toast.error('Error!');
  }

  showSuccess() {
    this.toast.success('Success!');
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

  logSelectedItem(event) {
    console.log(event);
  }

  showItemDetails(data) {
    this.toast.info(data.name);
  }

  @computedFrom('selectedDialogMode')
  get isDialogModalMode() {
    return this.selectedDialogMode === 'modal';
  }
}
