import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { ValidationController, ValidationRules, validationMessages } from 'aurelia-validation';

import { frenchValidationMessages } from 'core/validation-messages';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Clicks a checkbox, which toggles it and fires its change event.
 * @param {HTMLInputElement} checkbox the checkbox
 */
function check(checkbox) {
  checkbox.click();
}

/**
 * Presses a key on the target.
 * @param {Element} target focused element
 * @param {string} key key name
 */
function press(target, key) {
  target.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

describe('als-multi-select', () => {
  let component;
  let controller;
  let model;
  beforeAll(() => {
    Object.assign(validationMessages, frenchValidationMessages);
    // bootstrap creates its events with the global classes: they must be jsdom's (window), not node's (global)
    /* eslint-disable unicorn/prefer-global-this */
    global.Event = window.Event;
    /* eslint-enable unicorn/prefer-global-this */
  });

  beforeEach(async () => {
    model = { years: [] };
    let aurelia;
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/als-dropdown/als-dropdown'),
      PLATFORM.moduleName('elements/forms/als-field/als-field'),
      PLATFORM.moduleName('elements/forms/als-multi-select/als-multi-select')
    ])
      .inView(
        `<als-field label="Years">
          <als-multi-select items.bind="items" value.bind="model.years & validate"></als-multi-select>
        </als-field>
        <button id="outside"></button>`
      )
      .boundTo({
        model,
        items: [
          { label: 'Année 2025', value: 2025 },
          { label: 'Année 2026', value: 2026 }
        ]
      });
    component.bootstrap(au => {
      aurelia = au;
      au.use.standardConfiguration().plugin(PLATFORM.moduleName('aurelia-validation'));
      au.container.registerSingleton(ValidationController);
    });
    await component.create(bootstrap);
    await flush();
    // rules can only be declared once the validation plugin is configured
    ValidationRules.ensure('years').minItems(1).on(model);
    controller = aurelia.container.get(ValidationController);
  });

  afterEach(() => component.dispose());

  test('moves between the checkboxes with the arrows, the menu being a list', async () => {
    const menu = document.querySelector('.dropdown-menu');
    // the divider too is in a list item
    expect([...menu.children].every(child => child.tagName === 'LI')).toBe(true);
    const [all, first, second] = document.querySelectorAll('.dropdown-menu input[type="checkbox"]');
    const toggle = document.querySelector('.dropdown-toggle');
    toggle.focus();
    press(toggle, 'ArrowDown');
    await flush();
    expect(document.activeElement).toBe(all);
    press(all, 'ArrowDown');
    expect(document.activeElement).toBe(first);
    press(first, 'ArrowDown');
    expect(document.activeElement).toBe(second);
    press(second, 'ArrowUp');
    expect(document.activeElement).toBe(first);
  });

  test('links the label to the toggle button and updates the bound value', async () => {
    const toggle = document.querySelector('.dropdown-toggle');
    expect(document.querySelector('label').getAttribute('for')).toBe(toggle.id);
    expect(toggle.textContent.trim()).toBe('Sélectionner');

    const [all, first, second] = document.querySelectorAll('.form-check-input');
    check(second);
    await flush();
    expect(model.years).toEqual([2026]);
    expect(toggle.textContent.trim()).toBe('Année 2026');
    expect(all.indeterminate).toBe(true);

    check(all);
    await flush();
    expect(model.years).toEqual([2025, 2026]);
    expect(first.checked).toBe(true);

    check(all);
    await flush();
    expect(model.years).toEqual([]);
  });

  test('renders the validation error on the toggle button', async () => {
    const toggle = document.querySelector('.dropdown-toggle');
    const textId = toggle.getAttribute('aria-describedby');

    await controller.validate();
    await flush();
    expect(toggle.classList).toContain('is-invalid');
    expect(toggle.getAttribute('aria-invalid')).toBe('true');
    expect(toggle.getAttribute('aria-describedby')).toBe(`${textId} ${toggle.id}-error`);
    expect(document.querySelector('small').textContent.trim()).toBe(
      'Veuillez sélectionner au moins 1 élément.'
    );

    check(document.querySelectorAll('.form-check-input')[1]);
    await controller.validate();
    await flush();
    expect(toggle.classList).not.toContain('is-invalid');
    expect(toggle.getAttribute('aria-describedby')).toBe(textId);
  });

  test('validates when the focus leaves the element, not when it moves inside', async () => {
    const toggle = document.querySelector('.dropdown-toggle');
    const [all] = document.querySelectorAll('.form-check-input');

    toggle.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: all }));
    await flush();
    expect(toggle.classList).not.toContain('is-invalid');

    toggle.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: document.querySelector('#outside') })
    );
    await flush();
    expect(toggle.classList).toContain('is-invalid');
  });
});
