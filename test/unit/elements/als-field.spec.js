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
    // the screen readers read the requirement in the name of the control
    expect(document.querySelector('label .visually-hidden').textContent).toBe('(obligatoire)');
  });

  test('does not mark an optional control as required', async () => {
    ({ component } = await stage('<als-field label="Name"><input></als-field>', {}, false));
    expect(document.querySelector('label span')).toBeNull();
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
    // bootstrap feedback class: colored with the theme `$form-invalid-color` token
    expect(message.classList).toContain('invalid-feedback');
    expect(message.textContent.trim()).toBe('Ce champ est obligatoire.');

    model.name = 'John';
    await controller.validate();
    await flush();
    expect(input.classList).not.toContain('is-invalid');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.hasAttribute('aria-describedby')).toBe(false);
    expect(message.textContent.trim()).toBe('');
  });

  test('renders an error added by the controller, e.g. returned by a server, until the property is validated again', async () => {
    const model = { email: 'deja@utilise.fr' };
    ValidationRules.ensure('email').required().on(model);
    let controller;
    ({ component, controller } = await stage(
      '<als-field label="Email"><input id="email" value.bind="model.email & validate"></als-field>',
      { model }
    ));
    const input = document.querySelector('#email');
    const message = document.querySelector('small');

    controller.addError('Cet email est déjà utilisé.', model, 'email');
    await flush();
    expect(input.classList).toContain('is-invalid');
    expect(input.getAttribute('aria-describedby')).toBe('email-error');
    expect(message.textContent.trim()).toBe('Cet email est déjà utilisé.');

    model.email = 'libre@exemple.fr';
    await controller.validate();
    await flush();
    expect(input.classList).not.toContain('is-invalid');
    expect(message.textContent.trim()).toBe('');
    expect(controller.errors).toHaveLength(0);
  });

  test('drops the errors of a field removed by if.bind', async () => {
    const model = { other: '' };
    const context = { model, show: true };
    ValidationRules.ensure('other').required().on(model);
    let controller;
    ({ component, controller } = await stage(
      '<als-field if.bind="show" label="Précisez"><input id="other" value.bind="model.other & validate"></als-field>',
      context
    ));

    await controller.validate();
    await flush();
    expect(document.querySelector('#other').classList).toContain('is-invalid');
    expect(controller.errors).toHaveLength(1);

    context.show = false;
    await flush();
    expect(document.querySelector('als-field')).toBeNull();
    expect(controller.errors).toHaveLength(0);
    const { valid } = await controller.validate();
    expect(valid).toBe(true);

    context.show = true;
    await flush();
    expect(document.querySelector('#other').classList).not.toContain('is-invalid');
    expect(document.querySelector('small').textContent.trim()).toBe('');
  });

  describe('group', () => {
    const radios = `
      <als-field label="Civilité" required="true" hint="Choisir une valeur." group="true">
        <input type="radio" id="mme" model.bind="'MME'" checked.bind="model.civility & validate">
        <input type="radio" id="m" model.bind="'M'" checked.bind="model.civility & validate">
      </als-field>`;

    test('names the group with its label instead of a label pointing to the first control', async () => {
      ({ component } = await stage(radios, { model: { civility: null } }));
      const group = document.querySelector('[role="group"]');
      const label = document.querySelector('.form-label');
      expect(document.querySelector('label')).toBeNull();
      expect(group.getAttribute('aria-labelledby')).toBe(label.id);
      expect(label.textContent).toContain('Civilité');
      expect(label.querySelector('span').textContent).toBe('*');
      expect(label.querySelector('.visually-hidden').textContent).toBe('(obligatoire)');
      expect(document.querySelector('.input-group')).toBeNull();
    });

    test('describes the group with the hint and the error message', async () => {
      const model = { civility: null };
      ValidationRules.ensure('civility').required().on(model);
      let controller;
      ({ component, controller } = await stage(radios, { model }));
      const group = document.querySelector('[role="group"]');
      const hintId = document.querySelector('.form-text').id;
      const message = document.querySelector('small');
      const inputs = [...document.querySelectorAll('input')];
      expect(group.getAttribute('aria-describedby')).toBe(hintId);

      await controller.validate();
      await flush();
      expect(group.getAttribute('aria-describedby')).toBe(`${hintId} ${message.id}`);
      expect(message.textContent.trim()).toBe('Ce champ est obligatoire.');
      for (const input of inputs) {
        expect(input.classList).toContain('is-invalid');
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(input.hasAttribute('aria-describedby')).toBe(false);
      }

      model.civility = 'M';
      await controller.validate();
      await flush();
      expect(group.getAttribute('aria-describedby')).toBe(hintId);
      for (const input of inputs) {
        expect(input.classList).not.toContain('is-invalid');
      }
    });

    test('is not a group by default', async () => {
      ({ component } = await stage('<als-field label="Name"><input></als-field>', {}, false));
      const container = document.querySelector('.form-group');
      expect(container.hasAttribute('role')).toBe(false);
      expect(container.hasAttribute('aria-labelledby')).toBe(false);
      expect(container.hasAttribute('aria-describedby')).toBe(false);
    });
  });
});
