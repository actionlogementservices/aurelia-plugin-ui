import { customElement, inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

/** @typedef {import('aurelia-router').NavigationInstruction} NavigationInstruction */

/**
 * Implements the **`breadcrumbs` custom element** that displays the current route.
 * @category element
 */
@inject(Router)
@customElement('breadcrumbs')
export class Breadcrumbs {
  /**
   * Creates an instance of the `breadcrumbs` custom element.
   * @param {Router} router aurelia router
   */
  constructor(router) {
    while (router.parent) {
      router = router.parent;
    }
    this.router = router;
  }

  /**
   * Steps displayed after the home link: the instructions of the current route that have a title, except the default
   * route (`''`), already represented by the home link.
   * @param {NavigationInstruction} currentInstruction current navigation instruction of the root router
   * @returns {NavigationInstruction[]} displayed steps
   */
  steps(currentInstruction) {
    return (currentInstruction?.getAllInstructions() ?? []).filter(
      instruction => instruction.config.navModel?.title && ![instruction.config.route].flat().includes('')
    );
  }

  /**
   * Navigates to the specified route.
   * @param {NavigationInstruction} navigationInstruction navigration instruction to apply on click
   */
  navigate(navigationInstruction) {
    navigationInstruction.router.navigateToRoute(navigationInstruction.config.name);
  }
}
