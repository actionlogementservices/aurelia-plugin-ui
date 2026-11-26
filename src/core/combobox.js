/**
 * Keyboard of the select and auto-complete custom elements, after the WAI-ARIA combobox pattern with a listbox popup
 * (https://www.w3.org/WAI/ARIA/apg/patterns/combobox/): the focus stays on the input, the arrows move the active
 * option (`aria-activedescendant`) from the selected one, Enter (and Space on a read-only input) picks it, Escape
 * closes the listbox and Tab leaves the field.
 * @module core/combobox
 * @category core
 */

/** Class of the active option, which shows the focus ring while the focus stays on the input. */
const ACTIVE_OPTION = 'active-option';

/**
 * Clears the active option of a combobox.
 * @param {HTMLInputElement} input combobox input
 * @param {HTMLElement} listbox listbox of the options
 */
function clearActiveOption(input, listbox) {
  listbox.querySelector(`.${ACTIVE_OPTION}`)?.classList.remove(ACTIVE_OPTION);
  input.removeAttribute('aria-activedescendant');
}

/**
 * Clears the active option when the listbox closes, and when the text changes the options (typed, pasted, dictated...).
 * @param {HTMLInputElement} input combobox input, the toggle of the bootstrap dropdown
 * @param {HTMLElement} listbox listbox of the options
 */
export function bindCombobox(input, listbox) {
  const clear = () => clearActiveOption(input, listbox);
  input.addEventListener('hidden.bs.dropdown', clear);
  input.addEventListener('input', clear);
}

/**
 * Makes the specified option the active one.
 * @param {HTMLInputElement} input combobox input
 * @param {HTMLElement} listbox listbox of the options
 * @param {HTMLElement} option option to activate
 */
function activateOption(input, listbox, option) {
  clearActiveOption(input, listbox);
  option.classList.add(ACTIVE_OPTION);
  input.setAttribute('aria-activedescendant', option.id);
  option.scrollIntoView({ block: 'nearest' });
}

/**
 * Moves the active option with the arrows, the first move starting from the selected option if any.
 * @param {HTMLInputElement} input combobox input
 * @param {HTMLElement} listbox listbox of the options
 * @param {Element | undefined} active current active option
 * @param {boolean} down true to move down, false to move up
 */
function moveActiveOption(input, listbox, active, down) {
  /** @type {HTMLElement[]} */
  const options = [...listbox.querySelectorAll('[role="option"]:not([aria-disabled="true"])')];
  if (options.length === 0) return;
  const index = options.indexOf(/** @type {HTMLElement} */ (active));
  const selected = active
    ? undefined
    : options.find(option => option.getAttribute('aria-selected') === 'true');
  const next =
    selected ?? (down ? (options[index + 1] ?? options[0]) : (options[index - 1] ?? options.at(-1)));
  activateOption(input, listbox, next);
}

/**
 * Picks the active option with Enter (and Space on a read-only input), or opens a read-only combobox like a native
 * select, on its selected option.
 * @param {HTMLInputElement} input combobox input
 * @param {HTMLElement} listbox listbox of the options
 * @param {import('bootstrap').Dropdown} dropdown bootstrap dropdown showing the listbox
 * @param {Element | undefined} active current active option
 * @returns {boolean} true to let the browser handle the key, false when the key has been handled
 */
function pickOrOpen(input, listbox, dropdown, active) {
  if (active) {
    /** @type {HTMLElement} */ (active).click();
    return false;
  }
  if (!input.readOnly || listbox.classList.contains('show')) return true;
  dropdown.show();
  const selected = listbox.querySelector('[role="option"][aria-selected="true"]');
  if (selected) activateOption(input, listbox, /** @type {HTMLElement} */ (selected));
  return false;
}

/**
 * Handles a key pressed in the input of a combobox.
 * @param {KeyboardEvent} event keydown event of the input
 * @param {HTMLElement} listbox listbox of the options (the bootstrap dropdown menu)
 * @param {import('bootstrap').Dropdown} dropdown bootstrap dropdown showing the listbox
 * @returns {boolean} true to let the browser handle the key, false when the key has been handled
 */
export function handleComboboxKey(event, listbox, dropdown) {
  const input = /** @type {HTMLInputElement} */ (event.target);
  const expanded = listbox.classList.contains('show');
  const active = expanded ? listbox.querySelector(`.${ACTIVE_OPTION}`) : undefined;

  switch (event.key) {
    case 'ArrowDown':
    case 'ArrowUp': {
      if (!expanded) dropdown.show();
      moveActiveOption(input, listbox, active, event.key === 'ArrowDown');
      return false;
    }
    case ' ': {
      // Space types a space in an editable input
      return input.readOnly ? pickOrOpen(input, listbox, dropdown, active) : true;
    }
    case 'Enter': {
      return pickOrOpen(input, listbox, dropdown, active);
    }
    case 'Escape': {
      if (!expanded) return true;
      // the listbox only: an enclosing dialog stays open
      event.stopPropagation();
      dropdown.hide();
      return false;
    }
    case 'Tab': {
      if (expanded) dropdown.hide();
      return true;
    }
    default: {
      return true;
    }
  }
}
