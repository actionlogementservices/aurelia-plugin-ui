/** @typedef {'asc' | 'desc' | undefined} SortOrder*/
/** @typedef {'text' | 'numeric'} SortType */

/**
 * Defines the common sorting functions.
 * @module
 * @category internal
 */

/**
 * Gets the value of an object scalar property as a string.
 * @param {Record<string, any>} object object
 * @param {string} key property of the object
 * @returns {string} value of the property as string or the empty string
 */
export const safeString = (object, key) =>
  String(object && Object.hasOwn(object, key) ? (object[key] ?? '') : '');

/**
 * Sorts objects ascendantly by the specified key.
 * @param {string} key property of the object
 * @param {Intl.CollatorOptions} sortingOptions sorting options
 * @returns {(a: Record<string, any>, b: Record<string, any>) => number} sorting function
 */
export const ascendantPerKey = (key, sortingOptions) => (a, b) =>
  safeString(a, key).localeCompare(safeString(b, key), undefined, sortingOptions);

/**
 * Sorts objects descendantly by the specified key.
 * @param {string} key property of the object
 * @param {Intl.CollatorOptions} sortingOptions sorting options
 * @returns {(a: Record<string, any>, b: Record<string, any>) => number} sorting function
 */
export const descendantPerKey = (key, sortingOptions) => (a, b) =>
  safeString(b, key).localeCompare(safeString(a, key), undefined, sortingOptions);

/**
 * Sorts objects by the specified key and sorting options.
 * @param {SortOrder} sortOrder sorting order
 * @param {SortType} sortType sorting type
 * @param {string} key property of the object
 * @returns {(a: Record<string, any>, b: Record<string, any>) => number} sorting function
 */
export const sortPerKey = (sortOrder, sortType, key) => {
  /** @type {Intl.CollatorOptions} */ const sortOptions =
    sortType === 'numeric' ? { numeric: true } : { sensitivity: 'base', ignorePunctuation: true };
  return sortOrder === 'asc' ? ascendantPerKey(key, sortOptions) : descendantPerKey(key, sortOptions);
};
