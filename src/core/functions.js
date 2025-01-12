/** @typedef {import('types').SupportedFormat} SupportedFormat */
/** @typedef {import('types').DateFormatValidator} DateFormatValidator */

/**
 * Defines common functions.
 * @module
 * @category internal
 */

const maxCommonLength = 19;

/**
 * Waits for the specify delay.
 * @param {number} delay delay in milliseconds
 * @returns {Promise<void>} promise resolved after the delay
 */
export const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Checks if the provided value is a null or undefined?
 * @param {any} value value to check
 * @returns {boolean} true if the specified value is null or empty?
 */
export const isNil = value => value === undefined || value === null;

/**
 * Checks if the provided value is a null, undefined or empty?
 * @param {any} value value to check
 * @returns {boolean} true if the specified value is null, undefined or empty?
 */
export const isNilOrEmpty = value =>
  value === undefined ||
  value === null ||
  value.length === 0 ||
  Object.getOwnPropertyNames(value).length === 0;

/**
 * Generates an unique identifier string of the form 'm5y6ckpexb01gvv02s'.
 * @returns {string} unique identifier
 */
export const generateUniqueId = () => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).slice(2);
  return timestamp + randomPart;
};

/**
 * Checks if the provided value is a string?
 * @param {any} value value to check
 * @returns {boolean} true if the specified value is a string, false otherwise
 */
export const isString = value => typeof value === 'string' || value instanceof String;

/**
 * Checks if the provided value is a date?
 * @param {any} value value to check
 * @returns {boolean} true if the specified value is a date, false otherwise
 */
export const isDate = value => value instanceof Date;

/**
 * Checks if the provided value is a date time ISO string?
 * @param {string} value value to check
 * @returns {boolean}  true if the specified value is a date ISO string, false otherwise
 */
export const isValidDateTimeISOString = value => {
  if (!isString(value)) return false;
  const dateParsed = new Date(Date.parse(value));
  return (
    // @ts-ignore
    !isNaN(dateParsed) &&
    dateParsed.toISOString().slice(0, maxCommonLength) === value.slice(0, maxCommonLength)
  );
};

/**
 * Supported date formats.
 * @type {Record<SupportedFormat,DateFormatValidator>}
 */
export const dateFormat = {
  'YYYY-MM-DD': {
    regexp: /^(\d{4})-(\d{2})-(\d{2})$/,
    matches: { day: 3, month: 2, year: 1 }
  },
  'DD/MM/YYYY': {
    regexp: /^(\d{2})\/(\d{2})\/(\d{4})$/,
    matches: { day: 1, month: 2, year: 3 },
    output: { culture: 'fr-FR', options: { day: '2-digit', month: '2-digit', year: 'numeric' } }
  },
  'MM/DD/YYYY': {
    regexp: /^(\d{2})\/(\d{2})\/(\d{4})$/,
    matches: { day: 2, month: 1, year: 3 },
    output: { culture: 'en-US', options: { day: '2-digit', month: '2-digit', year: 'numeric' } }
  }
};

/**
 * Checks if the provided value is a date with the specified format?
 * Time part is truncated.
 * @param {string} value value to check
 * @param {SupportedFormat} [format] format to check, by default ISO string: `YYYY-MM-DD`
 * @returns { {valid: boolean, date?: Date}} indicates if the date is valid and then provides the Date instance.
 */
export const isValidDate = (value, format = 'YYYY-MM-DD') => {
  const options = dateFormat[format];
  if (isNilOrEmpty(value)) return { valid: false };
  const match = value.slice(0, 10).match(options.regexp);
  if (!match) return { valid: false };
  const day = parseInt(match[options.matches.day], 10);
  const month = parseInt(match[options.matches.month], 10) - 1; // Months are zero-based in JavaScript Date
  const year = parseInt(match[options.matches.year], 10);
  const date = new Date(year, month, day);
  return { valid: date.getFullYear() === year && date.getMonth() === month && date.getDate() === day, date };
};
