/** @template T @typedef {import('types').ISearchable<T>} ISearchable */
/** @template T,U @typedef {import('types').IItemModelBuilder<T, U>} IItemModelBuilder */
/** @template K,T @typedef {import('types').IByKeyGetter<K,T>} IByKeyGetter */

/**
 * Imlements a controller that retrieves data on the fly for an 'auto-complete' custom element.
 * @template T type of items that are retrieved with the controller
 * @template U type of items that are displayed
 * @template K type of selected item value
 * @category autocomplete
 */
export class AutoCompleteController {
  /**
   * Creates an instance of the autocomplete controller.
   * @param {ISearchable<T>} search query function that retrieves item to display
   * @param {IItemModelBuilder<T,U>} [buildItemModel] build the model of type `U` to be displayed based on the response object of type `T` retrieved by the query function
   * @param {IByKeyGetter<K,T>} [getItems] query function that retrieves items by their values
   */
  configure(search, buildItemModel = item => item, getItems) {
    this._search = search;
    this._buildItemModel = buildItemModel;
    this._getItems = getItems;
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
   * Gets the item corresponding to the specified value.
   * @param {K[]} itemValues item values
   * @returns {Promise<(U | T)[]>} corresponding results
   */
  async getItems(itemValues) {
    if (!itemValues || !Array.isArray(itemValues)) return;
    const items = await this._getItems(itemValues);
    return items?.map(item => this._buildItemModel(item)) || [];
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
