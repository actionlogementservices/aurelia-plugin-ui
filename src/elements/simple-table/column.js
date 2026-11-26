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
/**
 * @typedef {import('aurelia-framework').BehaviorInstruction & {
 *   template: InlineViewStrategy,
 *   headerTemplate: InlineViewStrategy,
 * }} ViewBehaviorInstruction
 */

/**
 * Creates the cell and header template instructions.
 * A `<template replace-part="header">` child, if present, defines the header content (allowing
 * arbitrary html/bindings, e.g. an icon with a bootstrap tooltip). Any other remaining content
 * defines the cell template, as before.
 * @param {ViewCompiler} _compile unused
 * @param {ViewResources} _resources unused
 * @param {HTMLElement} element the column inner element that defines the header and cell templates
 * @param {ViewBehaviorInstruction} instruction view instruction to enhance in order to provide the templates
 * @returns {boolean} true indicating that the compiler should also process the content
 */
function retrieveTemplates(_compile, _resources, element, instruction) {
  const headerElement = element.querySelector(':scope > template[replace-part="header"]');
  if (headerElement) {
    instruction.headerTemplate = new InlineViewStrategy(`<template>${headerElement.innerHTML}</template>`);
    headerElement.remove();
  }
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
@processContent(retrieveTemplates)
@inject(TargetInstruction)
export class Column {
  /** Header of the column. Ignored if a `<template replace-part="header">` is provided. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  header;

  /** Property key used on the row object to display as cell content. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  cellKey;

  /** Is the column sortable. @type {boolean} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  sortable = false;

  /**
   * Sorting order of the column: the initial sort of the table when set, then the `sort` of the table.
   * @type {undefined | 'asc' | 'desc'}
   */
  @bindable({ defaultBindingMode: bindingMode.toView })
  sortOrder;

  /** Sorting type of the column. @type {'text' | 'numeric'} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  sortType = 'text';

  /** CSS width of the column. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  width;

  /** Cell template. @type {InlineViewStrategy} */ cellTemplate;
  /** Header template, allowing arbitrary html content in the column header. @type {InlineViewStrategy} */ headerTemplate;

  /**
   * Creates an instance of the `column` custom element.
   * @param {TargetInstruction} targetInstruction instruction for how a target element should be enhanced inside of a view
   */
  constructor(targetInstruction) {
    const elementInstruction = /** @type {ViewBehaviorInstruction}*/ (targetInstruction.elementInstruction);
    this.cellTemplate = elementInstruction.template;
    this.headerTemplate = elementInstruction.headerTemplate;
  }

  /**
   * Sort order of the column for the screen readers (`aria-sort` of its header), none when the column is not sorted.
   * @returns {'ascending' | 'descending' | undefined} aria-sort value
   */
  @computedFrom('sortOrder')
  get ariaSort() {
    /** @type {Record<string, 'ascending' | 'descending'>} */
    const values = { asc: 'ascending', desc: 'descending' };
    return values[this.sortOrder];
  }

  /**
   * Icon representing the sort order.
   * @returns {string} bootstrap icon
   */
  @computedFrom('sortOrder')
  get sortIcon() {
    if (this.sortOrder === 'asc' && this.sortType === 'text')
      return 'sort-alpha-up align-middle text-primary fs-6';
    if (this.sortOrder === 'desc' && this.sortType === 'text')
      return 'sort-alpha-down-alt align-middle text-primary fs-6';
    if (this.sortOrder === 'asc' && this.sortType === 'numeric')
      return 'sort-numeric-up align-middle text-primary fs-6';
    if (this.sortOrder === 'desc' && this.sortType === 'numeric')
      return 'sort-numeric-down-alt align-middle text-primary fs-6';
    return 'sort-up-alt align-middle text-body-secondary fs-6';
  }
}
