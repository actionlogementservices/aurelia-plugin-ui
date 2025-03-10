import {
  TargetInstruction,
  inject,
  bindable,
  bindingMode,
  InlineViewStrategy,
  noView,
  processContent,
  computedFrom
} from 'aurelia-framework';

/** @typedef {import('aurelia-framework').ViewCompiler} ViewCompiler */
/** @typedef {import('aurelia-framework').ViewResources} ViewResources */
/** @typedef {import('aurelia-framework').BehaviorInstruction & {template: InlineViewStrategy}} ViewBehaviorInstruction */

/**
 * Creates a template instruction
 * @param {ViewCompiler} _compile unused
 * @param {ViewResources} _resources unused
 * @param {HTMLElement} element the column inner element that defines the cell template
 * @param {ViewBehaviorInstruction} instruction view instruction to enhance in order to provide a cell template
 * @returns {boolean} true indicating that the compiler should also process the content
 */
function retrieveCellTemplate(_compile, _resources, element, instruction) {
  const cellTemplate = element.innerHTML;
  if (cellTemplate !== '') {
    instruction.template = new InlineViewStrategy(`<template>${cellTemplate}</template>`);
  }
  return true;
}

/**
 * Implements the **`column` custom element** that provides the definition of the grid column.
 * @category table
 */
@noView
@processContent(retrieveCellTemplate)
@inject(TargetInstruction)
export class Column {
  /** Header ot the column. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  header;

  /** Property key used on the row object to display as cell content. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  cellKey;

  /** Is the column sortable. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  sortable = false;

  /** Sorting order of the column. @type {undefined | 'asc' | 'desc'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  sortOrder;

  /** Sorting type of the column. @type {'text' | 'numeric'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  sortType = 'text';

  /** CSS width of the column. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  width = 'auto';

  /** Cell template. @type {InlineViewStrategy} */ cellTemplate;

  /**
   * Creates an instance of the `column` custom element.
   * @param {TargetInstruction} targetInstruction instruction for how a target element should be enhanced inside of a view
   */
  constructor(targetInstruction) {
    this.cellTemplate = /** @type {ViewBehaviorInstruction}*/ (targetInstruction.elementInstruction).template;
  }

  /**
   * Defines the logic triggered when the component is added to the DOM.
   */
  attached() {}

  /**
   * Defines the logic triggered when the component is removed from the DOM.
   */
  detached() {}

  /**
   * Icon representing the sort order.
   * @returns {string} bootstrap icon
   */
  @computedFrom('sortOrder')
  get sortIcon() {
    if (this.sortOrder === 'asc' && this.sortType === 'text')
      return 'sort-alpha-up align-middle text-secondary fs-6';
    if (this.sortOrder === 'desc' && this.sortType === 'text')
      return 'sort-alpha-down-alt align-middle text-secondary fs-6';
    if (this.sortOrder === 'asc' && this.sortType === 'numeric')
      return 'sort-numeric-up align-middle text-secondary fs-6';
    if (this.sortOrder === 'desc' && this.sortType === 'numeric')
      return 'sort-numeric-down-alt align-middle text-secondary fs-6';
    return 'sort-up-alt align-middle text-light fs-6';
  }
}
