import { inject, Container, CompositionEngine, ViewSlot, NewInstance } from 'aurelia-framework';
import { ToastRenderer } from './toast-renderer';
import { Toast } from './toast';

/** @typedef {import('types').ThemeColor} ThemeColor */
/** @typedef {import('types').NotificationType} NotificationType */
/** @typedef {import('aurelia-framework').CompositionContext} CompositionContext */
/** @typedef {import('aurelia-framework').Controller} ViewController */

/**
 * Default toast delay
 * @type {number}
 */
const defaultHideDelay = 4000;

/**
 * Toast types.
 * @type { Record<NotificationType, ThemeColor>}
 */
export const toastType = {
  info: 'info',
  warning: 'warning',
  error: 'danger',
  success: 'success'
};

/**
 * Implements the toast service.
 * @category toast
 */
@inject(CompositionEngine, Container, NewInstance.of(ToastRenderer))
export class ToastService {
  /**
   * Creates an instance of the ToastService class.
   * @param {CompositionEngine} compositionEngine aurelia composition engine
   * @param {Container} container aurelia container
   * @param {ToastRenderer} renderer toast renderer
   */
  constructor(compositionEngine, container, renderer) {
    this._container = container;
    container.registerTransient(Toast);
    this._compositionEngine = compositionEngine;
    this._renderer = renderer;
  }

  /**
   * Displays the toast.
   * @private
   * @param {string} message toast message
   * @param {ThemeColor} color color of toast
   * @param {number} delay delay before hiding toast
   */
  async _show(message, color, delay) {
    const host = this._renderer.createOrGetRootHost();
    /** @type {CompositionContext} */
    const compositionContext = {
      viewModel: this._container.get(Toast).set(message, color),
      container: this._container,
      bindingContext: undefined,
      viewResources: undefined,
      viewSlot: new ViewSlot(host, true)
    };
    /** @type {ViewController} */
    // @ts-ignore
    const viewModelController = await this._compositionEngine.compose(compositionContext);
    // @ts-ignore
    const toastDiv = viewModelController.view.firstChild.nextSibling;
    delay === 0 ? await this._renderer.show(toastDiv) : await this._renderer.show(toastDiv, delay);
    viewModelController.view.unbind();
    viewModelController.view.removeNodes();
  }

  /**
   * Displays a toast info message.
   * @param {string} message toast message
   * @param {number} [delay] delay before hiding toast, default value is `defaultHideDelay`
   */
  async info(message, delay = defaultHideDelay) {
    await this._show(message, toastType.info, delay);
  }

  /**
   * Displays a toast error message.
   * @param {string} message toast message
   * @param {number} [delay] delay before hiding toast, default value is `defaultHideDelay`
   */
  async error(message, delay = defaultHideDelay) {
    await this._show(message, toastType.error, delay);
  }

  /**
   * Displays a toast warning message.
   * @param {string} message toast message
   * @param {number} [delay] delay before hiding toast, default value is `defaultHideDelay`
   */
  async warning(message, delay = defaultHideDelay) {
    await this._show(message, toastType.warning, delay);
  }

  /**
   * Displays a toast success message.
   * @param {string} message toast message
   * @param {number} [delay] delay before hiding toast, default value is `defaultHideDelay`
   */
  async success(message, delay = defaultHideDelay) {
    await this._show(message, toastType.success, delay);
  }
}
