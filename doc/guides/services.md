# Services

| Service | Role | API |
|---|---|---|
| [`DialogService`](#dialogservice) | Opens a viewmodel/view in a Bootstrap [modal](https://getbootstrap.com/docs/5.3/components/modal/) or [offcanvas](https://getbootstrap.com/docs/5.3/components/offcanvas/) | [DialogService](../src-core-dialog-service_dialog-service.md) |
| [`ToastService`](#toastservice) | Displays transient Bootstrap [toasts](https://getbootstrap.com/docs/5.3/components/toasts/) | [ToastService](../src-core-toast-service_toast-service.md) |
| [`LockService`](#lockservice) | Locks the screen to prevent the user from interacting with the page | [LockService](../src-core-lock-service_lock-service.md) |

## `DialogService`

1. Create a viewmodel and a view for the dialog. Inject the
   [`DialogController`](../src-core-dialog-service_dialog-controller.md) in the viewmodel, and close the dialog with
   `ok(output)` (confirmed) or `cancel()` (cancelled). The input parameters are received by `activate`.

   ```javascript
   // example-dialog.js
   import { inject } from 'aurelia-framework';
   import { DialogController } from '@actionlogementservices/aurelia-plugin-ui';

   @inject(DialogController)
   export class ExampleDialog {
     /** @param {DialogController} controller */
     constructor(controller) {
       this._controller = controller;
     }

     activate({ amount }) {
       this.amount = amount;
     }

     confirm() {
       this._controller.ok({ total: this.amount * 2 });
     }

     cancel() {
       this._controller.cancel();
     }
   }
   ```

   The view contains the inner markup of a Bootstrap modal (`modal-dialog`), or of an offcanvas (`offcanvas-header` and
   `offcanvas-body`):

   ```html
   <!-- example-dialog.html -->
   <template>
     <div class="modal-dialog">
       <div class="modal-content">
         <div class="modal-header">
           <h5 class="modal-title">Calcul</h5>
           <button type="button" class="btn-close" aria-label="Fermer" click.trigger="cancel()"></button>
         </div>
         <div class="modal-body">...</div>
         <div class="modal-footer">
           <button class="btn btn-primary" click.trigger="confirm()">Oui</button>
           <button class="btn btn-secondary" click.trigger="cancel()">Non</button>
         </div>
       </div>
     </div>
   </template>
   ```

   ```html
   <!-- or for an offcanvas -->
   <template>
     <div class="offcanvas-header">
       <h5 class="offcanvas-title">Titre</h5>
       <button type="button" class="btn-close" aria-label="Fermer" click.trigger="cancel()"></button>
     </div>
     <div class="offcanvas-body">...</div>
   </template>
   ```

1. Inject the `DialogService` in the caller and open the dialog. `open` resolves, once the dialog is closed, with a
   [`DialogResult`](../src-core-dialog-service_dialog-result.md): `wasCancelled` and the `output` passed to `ok`.

   ```javascript
   // example.js
   import { inject } from 'aurelia-framework';
   import { DialogService } from '@actionlogementservices/aurelia-plugin-ui';
   import { ExampleDialog } from './dialogs/example-dialog';

   @inject(DialogService)
   export class Example {
     /** @param {DialogService} dialog */
     constructor(dialog) {
       this._dialog = dialog;
     }

     async openExampleDialog() {
       const { wasCancelled, output } = await this._dialog.open({
         viewModel: ExampleDialog,
         model: { amount: 1000 },
         locked: true
       });
       if (!wasCancelled) this.total = output.total;
     }
   }
   ```

A dialog closed with the Escape key or by a click outside is cancelled (`wasCancelled` is `true`). When it closes, the
focus goes back to the element that opened it. A dialog opened from another one is stacked above it.

| Parameter of `open` | Role | Possible values | Default value |
|---|---|---|---|
| `viewModel` | Viewmodel of the dialog | Class or module id | |
| `view` | View of the dialog, when it is not the conventional one of the viewmodel | Module id | |
| `model` | Input parameters, passed to the `activate` method of the viewmodel | Any | |
| `mode` | Rendering mode of the dialog: a Bootstrap **modal** or **offcanvas** | `modal` or `offcanvas` | `modal` |
| `locked` | Prevents the dialog from being closed by a click outside | `true` or `false` | `false` |
| `fullscreen` | Fullscreen modal. Only for `modal` mode | `true` or `false` | `false` |
| `position` | Position of the offcanvas. Only for `offcanvas` mode | `start`, `end`, `top`, `bottom` | `start` |

## `ToastService`

Inject the `ToastService` and call `info`, `success`, `warning` or `error` with the message, and optionally the delay
in ms before the toast hides (`4000` by default).

```javascript
import { inject } from 'aurelia-framework';
import { ToastService } from '@actionlogementservices/aurelia-plugin-ui';

@inject(ToastService)
export class Example {
  /** @param {ToastService} toast */
  constructor(toast) {
    this._toast = toast;
  }

  save() {
    this._toast.success('Enregistrement effectué.');
    this._toast.error('Le service est indisponible.', 10000);
  }
}
```

## `LockService`

The `LockService` holds the lock state (`isLocked`), shared by the whole application. The `<lock>` custom element
displays it as a backdrop preventing any interaction: place it once, in the root view of the application.

```html
<!-- app.html -->
<template>
  <lock locked.bind="lock.isLocked"></lock>
  <router-view></router-view>
</template>
```

Inject the service where you need to lock the screen, and always unlock it, even when the operation fails:

```javascript
import { inject } from 'aurelia-framework';
import { LockService } from '@actionlogementservices/aurelia-plugin-ui';

@inject(LockService)
export class Example {
  /** @param {LockService} lock */
  constructor(lock) {
    this.lock = lock;
  }

  async save() {
    this.lock.lock();
    try {
      await this._api.save(this.model);
    } finally {
      this.lock.unlock();
    }
  }
}
```
