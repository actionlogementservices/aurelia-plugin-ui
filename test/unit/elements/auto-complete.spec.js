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
  beforeAll(() => Object.assign(validationMessages, frenchValidationMessages));

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

  test.each(['ArrowDown', 'ArrowUp', 'Tab'])(
    'moves the focus to the first item on %s, and keeps it on the input when there is no result',
    async keyCode => {
      const input = document.querySelector('auto-complete > input');
      const viewModel = document.querySelector('auto-complete').au['auto-complete'].viewModel;

      await viewModel.loadItems('Inconnue');
      await flush();
      expect(() => viewModel.manageKey(keyCode)).not.toThrow();
      expect(document.activeElement).toBe(input);

      await viewModel.loadItems('Par');
      await flush();
      viewModel.manageKey(keyCode);
      expect(document.activeElement.textContent.trim()).toBe('Paris');
    }
  );

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
