import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { ValidationController, ValidationRules, validationMessages } from 'aurelia-validation';

import { frenchValidationMessages } from 'core/validation-messages';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

describe('als-datepicker', () => {
  let component;
  let controller;
  let model;
  beforeAll(() => {
    Object.assign(validationMessages, frenchValidationMessages);
    // vanillajs-datepicker uses the global event classes: they must be jsdom's (window), not node's (global)
    /* eslint-disable unicorn/prefer-global-this */
    global.EventTarget = window.EventTarget;
    global.CustomEvent = window.CustomEvent;
    /* eslint-enable unicorn/prefer-global-this */
  });

  beforeEach(async () => {
    model = { date: undefined };
    let aurelia;
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/input-datepicker/input-datepicker'),
      PLATFORM.moduleName('elements/forms/als-field/als-field'),
      PLATFORM.moduleName('elements/forms/als-datepicker/als-datepicker')
    ])
      .inView(
        `<als-field label="Date">
          <als-datepicker value.bind="model.date & validate"></als-datepicker>
        </als-field>
        <button id="outside"></button>`
      )
      .boundTo({ model });
    component.bootstrap(au => {
      aurelia = au;
      au.use.standardConfiguration().plugin(PLATFORM.moduleName('aurelia-validation'));
      au.container.registerSingleton(ValidationController);
    });
    await component.create(bootstrap);
    await flush();
    // rules can only be declared once the validation plugin is configured
    ValidationRules.ensure('date').required().on(model);
    controller = aurelia.container.get(ValidationController);
  });

  afterEach(() => component.dispose());

  test('links the label to the inner input, not to the input-datepicker host', () => {
    const input = document.querySelector('input-datepicker > input');
    expect(input.id).toMatch(/^als-field-/);
    expect(document.querySelector('label').getAttribute('for')).toBe(input.id);
    expect(document.querySelector('input-datepicker').hasAttribute('id')).toBe(false);
  });

  test('renders the validation error on the inner input and updates the bound value', async () => {
    const input = document.querySelector('input-datepicker > input');

    await controller.validate();
    await flush();
    expect(input.classList).toContain('is-invalid');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(`${input.id}-error`);
    expect(document.querySelector('small').textContent.trim()).toBe('Ce champ est obligatoire.');

    model.date = new Date(2026, 10, 14).toISOString();
    await flush();
    expect(input.value).toBe('14/11/2026');
    await controller.validate();
    await flush();
    expect(input.classList).not.toContain('is-invalid');
  });

  test('validates when the focus leaves the element', async () => {
    const input = document.querySelector('input-datepicker > input');

    input.dispatchEvent(
      new FocusEvent('focusout', { bubbles: true, relatedTarget: document.querySelector('#outside') })
    );
    await flush();
    expect(input.classList).toContain('is-invalid');
  });
});
