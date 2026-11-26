import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { ValidationController, ValidationRules, validationMessages } from 'aurelia-validation';

import { frenchValidationMessages } from 'core/validation-messages';
import { AutoCompleteController } from 'elements/auto-complete/auto-complete-controller';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

const CITIES = [
  { code: '75056', name: 'Paris' },
  { code: '69123', name: 'Lyon' }
];

describe('auto-complete in an als-field', () => {
  let component;
  let controller;
  let model;
  beforeAll(() => {
    Object.assign(validationMessages, frenchValidationMessages);
    // bootstrap creates its events with the global classes: they must be jsdom's (window), not node's (global)
    /* eslint-disable unicorn/prefer-global-this */
    global.Event = window.Event;
    /* eslint-enable unicorn/prefer-global-this */
    // not implemented by jsdom
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  beforeEach(async () => {
    model = { city: undefined };
    const cityController = new AutoCompleteController();
    cityController.configure(
      async text => CITIES.filter(city => city.name.includes(text)),
      undefined,
      async codes => CITIES.filter(city => codes.includes(city.code))
    );
    let aurelia;
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/forms/als-field/als-field'),
      PLATFORM.moduleName('elements/auto-complete/auto-complete')
    ])
      .inView(
        `<als-field label="Ville">
          <auto-complete
            class="form-control"
            controller.bind="cityController"
            label-key="name"
            value-key="code"
            delay="0"
            selected-value.bind="model.city & validate"></auto-complete>
        </als-field>`
      )
      .boundTo({ model, cityController });
    component.bootstrap(au => {
      aurelia = au;
      au.use.standardConfiguration().plugin(PLATFORM.moduleName('aurelia-validation'));
      au.container.registerSingleton(ValidationController);
    });
    await component.create(bootstrap);
    await flush();
    // rules can only be declared once the validation plugin is configured
    ValidationRules.ensure('city').required().on(model);
    controller = aurelia.container.get(ValidationController);
  });

  afterEach(() => component.dispose());

  test('links the label to the search input', () => {
    const input = document.querySelector('auto-complete > input');
    expect(document.querySelector('label').getAttribute('for')).toBe(input.id);
  });

  test('marks the search input invalid, the host border relying on it, and clears the error on selection', async () => {
    const input = document.querySelector('auto-complete > input');
    const message = document.querySelector('small');

    await controller.validate();
    await flush();
    // auto-complete.css colors the host border with `auto-complete.form-control:has(> input.is-invalid)`
    expect(document.querySelector('auto-complete.form-control > input.is-invalid')).toBe(input);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(message.id);
    expect(message.textContent.trim()).toBe('Ce champ est obligatoire.');

    model.city = '75056';
    await flush();
    expect(input.value).toBe('Paris');
    await controller.validate();
    await flush();
    expect(input.classList).not.toContain('is-invalid');
    expect(message.textContent.trim()).toBe('');
  });

  test('the arrows move the active option among the results, the focus staying on the input', async () => {
    const input = document.querySelector('auto-complete > input');
    const viewModel = document.querySelector('auto-complete').au['auto-complete'].viewModel;
    const press = key => input.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true }));
    input.focus();

    await viewModel.loadItems('Inconnue');
    await flush();
    press('ArrowDown');
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);

    await viewModel.loadItems('Par');
    await flush();
    press('ArrowDown');
    expect(document.getElementById(input.getAttribute('aria-activedescendant')).textContent.trim()).toBe('Paris');
    expect(document.activeElement).toBe(input);

    press('Enter');
    await flush();
    expect(model.city).toBe('75056');
    expect(document.activeElement).toBe(input);
  });

  test('validates when leaving the field, e.g. after clearing the selection', async () => {
    const input = document.querySelector('auto-complete > input');
    model.city = '75056';
    await flush();
    expect(input.value).toBe('Paris');

    input.value = '';
    input.dispatchEvent(new window.Event('input'));
    await flush();
    expect(model.city).toBeUndefined();
    expect(input.classList).not.toContain('is-invalid');

    input.dispatchEvent(new window.Event('blur'));
    await flush();
    expect(input.classList).toContain('is-invalid');
    expect(document.querySelector('small').textContent.trim()).toBe('Ce champ est obligatoire.');
  });
});
