import { bindable, bindingMode } from 'aurelia-framework';

/**
 * Implements the **`loading-indicator` custom element** that tracks api calls.
 * @category element
 */
export class LoadingIndicatorCustomElement {
  /** Is there a call in progress? @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  loading = false;
}
