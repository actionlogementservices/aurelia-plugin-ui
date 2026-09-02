import { bindable, bindingMode, noView } from 'aurelia-framework';

/**
 * Implements the **`als-gtag` custom element** that injects the Google Tag Manager script and noscript fallback.
 * Use a single instance near the root of the application.
 * @category element
 */
@noView
export class AlsGtag {
  /** Google Tag Manager Id. @type {string} */
  @bindable({ defaultBindingMode: bindingMode.toView })
  tagId = 'GTM-XXXXXX';

  constructor() {}

  /**
   * Defines the logic triggered when the custom element is added to the DOM.
   */
  attached() {
    this.addGoogleTag(globalThis, document, 'script', 'dataLayer', this.tagId);
  }

  /**
   * Injects the Google Tag Manager script and its noscript iframe fallback.
   * @param {Window}   window browser global object
   * @param {Document} document browser document
   * @param {string} s script element tag name
   * @param {string} l data layer tag name
   * @param {string} tagId Google Tag Manager container identifier
   */
  addGoogleTag(window, document, s, l, tagId) {
    window[l] = window[l] || [];
    window[l].push({
      // eslint-disable-next-line unicorn/prefer-date-now
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });
    // eslint-disable-next-line unicorn/prefer-query-selector
    const scriptElements = document.getElementsByTagName(s)[0];
    const gtagScriptElement = document.createElement(s);
    // eslint-disable-next-line eqeqeq
    const dl = l == 'dataLayer' ? '' : '&l=' + l;
    gtagScriptElement.async = true;
    gtagScriptElement.src = 'https://www.googletagmanager.com/gtm.js?id=' + tagId + dl;
    scriptElements.parentNode.insertBefore(gtagScriptElement, scriptElements);

    const iframe = document.createElement('IFRAME');
    iframe.setAttribute('height', 0);
    iframe.setAttribute('width', 0);
    iframe.style.display = 'none';
    iframe.style.visibility = 'hidden';
    iframe.src = 'https://www.googletagmanager.com/ns.html?id=' + tagId;

    const noscript = document.createElement('noscript');
    // eslint-disable-next-line unicorn/prefer-dom-node-append
    noscript.appendChild(iframe);
    document.body.insertBefore(noscript, document.body.firstChild);
  }
}
