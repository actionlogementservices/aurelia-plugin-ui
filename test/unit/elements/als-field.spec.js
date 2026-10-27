import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { ValidationController, ValidationRules, validationMessages } from 'aurelia-validation';

import { frenchValidationMessages } from 'core/validation-messages';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Stages an `als-field` around an input bound with `& validate`.
 * @param {string} view the view to stage
 * @param {object} context binding context
 * @param {boolean} withController registers a validation controller in the root container
 * @returns {Promise<{component: any, controller?: ValidationController}>} the staged component and its controller
 */
async function stage(view, context, withController = true) {
  let aurelia;
  const component = StageComponent.withResources(PLATFORM.moduleName('elements/forms/als-field/als-field'))
    .inView(view)
    .boundTo(context);
  component.bootstrap(au => {
    aurelia = au;
    au.use.standardConfiguration().plugin(PLATFORM.moduleName('aurelia-validation'));
    if (withController) {
      au.container.registerSingleton(ValidationController);
    }
  });
  await component.create(bootstrap);
  await flush();
  return { component, controller: withController ? aurelia.container.get(ValidationController) : undefined };
}

describe('als-field', () => {
  let component;
  beforeAll(() => Object.assign(validationMessages, frenchValidationMessages));
  afterEach(() => component?.dispose());

  test('links the label to the control id, generating one when missing', async () => {
    ({ component } = await stage('<als-field label="Name"><input></als-field>', {}, false));
    const input = document.querySelector('input');
    expect(input.id).toMatch(/^als-field-/);
    expect(document.querySelector('label').getAttribute('for')).toBe(input.id);
  });

  test('keeps the control id and displays the required marker', async () => {
    ({ component } = await stage(
      '<als-field label="Name" required="true"><input id="name"></als-field>',
      {},
      false
    ));
    expect(document.querySelector('label').getAttribute('for')).toBe('name');
    expect(document.querySelector('label span').textContent).toBe('*');
  });

  test('displays the hint and references it from the control', async () => {
    ({ component } = await stage(
      '<als-field label="Age" hint="Valeur comprise entre 18 et 150."><input id="age"></als-field>',
      {},
      false
    ));
    expect(document.querySelector('#age-hint').textContent).toBe('Valeur comprise entre 18 et 150.');
    expect(document.querySelector('input').getAttribute('aria-describedby')).toBe('age-hint');
  });

  test.each([
    '<input type="text" id="name" value.bind="model.name & validate">',
    '<input type="email" id="name" value.bind="model.name & validate">',
    '<input type="search" id="name" value.bind="model.name & validate">',
    '<input type="tel" id="name" value.bind="model.name & validate">',
    '<input type="url" id="name" value.bind="model.name & validate">',
    '<input type="password" id="name" value.bind="model.name & validate">',
    '<textarea id="name" value.bind="model.name & validate"></textarea>',
    '<select id="name" value.bind="model.name & validate"><option value="">-</option><option>John</option></select>'
  ])('renders and clears the validation errors of %s', async control => {
    const model = { name: '' };
    ValidationRules.ensure('name').required().on(model);
    let controller;
    ({ component, controller } = await stage(`<als-field label="Name">${control}</als-field>`, { model }));
    const input = document.querySelector('#name');
    expect(document.querySelector('label').getAttribute('for')).toBe('name');
    const message = document.querySelector('small');

    await controller.validate();
    await flush();
    expect(input.classList).toContain('is-invalid');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('name-error');
    expect(message.id).toBe('name-error');
    expect(message.textContent.trim()).toBe('Ce champ est obligatoire.');

    model.name = 'John';
    await controller.validate();
    await flush();
    expect(input.classList).not.toContain('is-invalid');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(message.textContent.trim()).toBe('');
  });
});
