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
@inject(CompositionEngine, Container, Factory.of(DialogRenderer))
export class DialogService {
  /**
   * Creates an instance of the DialogService class.
   * @param {CompositionEngine} compositionEngine aurelia composition engine
   * @param {Container} container aurelia container
   * @param {() => DialogRenderer} rendererFactory dialog renderer factory
   */
  constructor(compositionEngine, container, rendererFactory) {
    this._container = container;
    this._compositionEngine = compositionEngine;
    this._rendererFactory = rendererFactory;
  }

  /**
   * Opens the dialog. A dialog opened while another one is open is stacked above it.
   * @param {DialogServiceParameters} parameters input parameters
   * @returns {Promise<DialogResult>} result of this dialog
   */
  async open(parameters) {
    const { viewModel, view, model, mode = 'modal', locked, fullscreen, position } = parameters;
    // creates the dialog instance, with its own result
    const renderer = this._rendererFactory();
    const result = new DialogResult();
    const host = renderer.createHost({ mode, locked, fullscreen, position });
    // creates a child container for this dialog
    const childContainer = this._container.createChild();
    childContainer.registerInstance(DialogRenderer, renderer);
    childContainer.registerInstance(DialogResult, result);
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
    return result;
  }
}
