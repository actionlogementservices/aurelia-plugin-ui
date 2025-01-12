import { inject, NewInstance } from 'aurelia-framework';
import { faker } from '@faker-js/faker';

import { AutoCompleteController } from 'resources/elements/auto-complete/auto-complete-controller';
import { LockService } from 'core/lock-service/lock-service';
import { ToastService } from 'core/toast-service/toast-service';
import { DialogService } from 'core/dialog-service/dialog-service';

export const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

/** @typedef {{ id: number, name: string; email: string; color: string }} Item */

@inject(NewInstance.of(AutoCompleteController), ToastService, LockService, DialogService)
export class App {
  /** @type {AutoCompleteController<Item> } */ controller;
  /** @type {Item[]} */ itemsList;
  /** @type {Item[]} */ smallItemsList;
  /** @type {Item[]} */ selectedItems;
  /** @type {Item} */ selectedItem;
  /** @type {string} */ selectedDate;

  /**
   * @param {AutoCompleteController} controller
   * @param {ToastService} toast
   * @param {LockService} lock
   * @param {DialogService} dialog
   */
  constructor(controller, toast, lock, dialog) {
    this.environment = { name: 'LOCAL', type: 'dev' };
    this.itemsController = controller;
    this.toast = toast;
    this.lock = lock;
    this.dialog = dialog;
    const itemsList = [];
    for (let index = 0; index < 120; index++) {
      const id = index;
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const color = faker.color.human();
      itemsList.push({ id, name, email, color });
    }
    this.itemsList = itemsList;
    this.smallItemsList = itemsList.slice(0,20);
  }

  activate() {
    this.itemsController.configure(text => this.itemsList.filter(item => item.name.toUpperCase().includes(text.toUpperCase())))
  }

  async lockScreen() {
    this.lock.lock();
    await wait(1000).finally(() => this.lock.unlock());
  }
}
