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
   * Navigates to the specified route.
   * @param {NavigationInstruction} navigationInstruction navigration instruction to apply on click
   */
  navigate(navigationInstruction) {
    navigationInstruction.router.navigateToRoute(navigationInstruction.config.name);
  }
}
