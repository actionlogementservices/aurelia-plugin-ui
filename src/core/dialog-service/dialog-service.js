import { inject, Container, CompositionEngine, ViewSlot, Factory } from 'aurelia-framework';
import { DialogRenderer } from './dialog-renderer';
import { DialogResult } from './dialog-result';
import { DialogController } from './dialog-controller';

/** @typedef {import('types').DialogServiceParameters} DialogServiceParameters */
/** @typedef {import('aurelia-framework').CompositionContext} CompositionContext */

/**
 * Implements the dialog service.
 * @category dialog
 */
@inject(CompositionEngine, Container, Factory.of(DialogRenderer), DialogResult)
export class DialogService {
  /**
   * Creates an instance of the DialogService class.
   * @param {CompositionEngine} compositionEngine aurelia composition engine
   * @param {Container} container aurelia container
   * @param {() => DialogRenderer} rendererFactory dialog renderer factory
   * @param {DialogResult} result dialog result
   */
  constructor(compositionEngine, container, rendererFactory, result) {
    this._container = container;
    this._compositionEngine = compositionEngine;
    this._rendererFactory = rendererFactory;
    this._result = result;
    this._currentModalRenderer = undefined; // track active modal only
  }

  /**
   * Opens the dialog.
   * @param {DialogServiceParameters} parameters input parameters
   * @returns {Promise<DialogResult>} modal dialog result
   */
  async open(parameters) {
    const { viewModel, view, model, mode = 'modal', locked, fullscreen, position } = parameters;
    // Switch only if mode is 'modal'
    if (mode === 'modal' && this._currentModalRenderer) {
      this._currentModalRenderer.hide();
      this._currentModalRenderer = undefined;
    }
    // creates the dialog instance
    const renderer = this._rendererFactory(); // new instance per dialog
    const host = renderer.createHost({ mode, locked, fullscreen, position });
    // Track modal renderer if mode is 'modal'
    if (mode === 'modal') {
      this._currentModalRenderer = renderer;
    }
    // creates a child container for this dialog
    const childContainer = this._container.createChild();
    childContainer.registerInstance(DialogRenderer, renderer);
    childContainer.registerInstance(DialogResult, this._result);
    childContainer.registerTransient(DialogController);
    /** @type {CompositionContext} */
    const compositionContext = {
      model,
      view,
      viewModel,
      host,
      container: childContainer,
      bindingContext: undefined,
      viewResources: undefined,
      viewSlot: new ViewSlot(host, true)
    };
    const viewModelController = await this._compositionEngine.compose(compositionContext);
    viewModelController.attached();
    await renderer.open({ mode, locked, fullscreen, position });
    // @ts-ignore
    viewModelController.view.unbind();
    // @ts-ignore
    viewModelController.view.removeNodes();
    return this._result;
  }
}
