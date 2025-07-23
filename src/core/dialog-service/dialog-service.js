import { inject, Container, CompositionEngine, ViewSlot } from 'aurelia-framework';
import { DialogRenderer } from './dialog-renderer';
import { DialogResult } from './dialog-result';

/** @typedef {import('types').DialogServiceParameter} DialogServiceParameter */
/** @typedef {import('aurelia-framework').CompositionContext} CompositionContext */

/**
 * Implements the modal dialog service.
 * @category dialog
 */
@inject(CompositionEngine, Container, DialogRenderer, DialogResult)
export class DialogService {
  /**
   * Creates an instance of the DialogService class.
   * @param {CompositionEngine} compositionEngine aurelia composition engine
   * @param {Container} container aurelia container
   * @param {DialogRenderer} renderer modal dialog renderer
   * @param {DialogResult} result modal dialog result
   */
  constructor(compositionEngine, container, renderer, result) {
    this._container = container;
    this._compositionEngine = compositionEngine;
    this._renderer = renderer;
    this._result = result;
  }

  /**
   * Opens the modal dialog.
   * @param {DialogServiceParameter} parameter input parameters
   * @returns {Promise<DialogResult>} modal dialog result
   */
  async open({ viewModel, view, model, locked, fullscreen }) {
    const host = this._renderer.createHost();
    /** @type {CompositionContext} */
    const compositionContext = {
      model,
      view,
      viewModel,
      host,
      container: this._container,
      bindingContext: undefined,
      viewResources: undefined,
      viewSlot: new ViewSlot(host, true)
    };

    const viewModelController = await this._compositionEngine.compose(compositionContext);
    viewModelController.attached();
    await this._renderer.open(locked, fullscreen);
    // @ts-ignore
    viewModelController.view.unbind();
    // @ts-ignore
    viewModelController.view.removeNodes();
    return this._result;
  }
}
