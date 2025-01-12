/** @template T @typedef {import('types').Search<T>} Search */
/** @template T,U @typedef {import('types').ItemModelBuilder<T, U>} ItemModelBuilder */

/**
 * Imlements a controller that retrieves data on the fly for an 'auto-complete' custom element.
 * @template T type of items that are retrieved with the controller
 * @template U type of items that are displayed
 * @category autocomplete
 */
export class AutoCompleteController {
  /**
   * Creates an instance of the autocomplete controller.
   * @param {Search<T>} search query function that retrieves item to display
   * @param {ItemModelBuilder<T,U>} buildItemModel build the model of type `U` to be displayed based on the response object of type `T` retrieved by the query function
   */
  configure(search, buildItemModel = item => item) {
    this._search = search;
    this._buildItemModel = buildItemModel;
  }

  /**
   * Searches the specified text and return corresponding results to display.
   * @param {string} searchText text to search
   * @returns {Promise<(U | T)[]>} corresponding results
   */
  async search(searchText) {
    if (!searchText) return [];
    const results = await this._search(searchText);
    return results.map(item => this._buildItemModel(item)) || [];
  }

  /**
   * Builds the model to be displayed.
   * @param {T} item item retrieved by the query function
   * @returns {undefined | U | T} model to be displayed
   */
  buildItemModel(item) {
    if (!this._buildItemModel) return;
    return this._buildItemModel(item);
  }
}
