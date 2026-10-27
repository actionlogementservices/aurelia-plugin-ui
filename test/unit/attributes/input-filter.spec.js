import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DOM, PLATFORM } from 'aurelia-pal';

/**
 * Stages a control using the `input-filter` attribute.
 * @param {string} filter the attribute value
 * @param {object} context binding context
 * @param {string} control the control markup, without the closing tag
 * @returns {Promise<any>} the staged component
 */
async function stage(filter, context, control = '<input') {
  const closing = control === '<textarea' ? '></textarea>' : ' />';
  const component = StageComponent.withResources(PLATFORM.moduleName('attributes/input-filter'))
    .inView(`${control} input-filter="${filter}" value.bind="value"${closing}`)
    .boundTo(context);
  await component.create(bootstrap);
  return component;
}

/**
 * Simulates a user input, the caret being placed at the specified position.
 * @param {string} value the new control value
 * @param {number} [caret] the caret position, at the end by default
 * @returns {HTMLInputElement | HTMLTextAreaElement} the control
 */
function type(value, caret = value.length) {
  const control = document.querySelector('input, textarea');
  control.value = value;
  if (control.selectionStart !== null) {
    control.setSelectionRange(caret, caret);
  }
  control.dispatchEvent(DOM.createCustomEvent('input', { bubbles: true }));
  return control;
}

describe('input-filter', () => {
  let component;
  afterEach(() => component?.dispose());

  test('email filter removes the forbidden characters before the binding updates the model', async () => {
    const context = { value: '' };
    component = await stage('email', context);
    const input = type('jéan dupont!+test@doe.fr');
    expect(input.value).toBe('jandupont+test@doe.fr');
    expect(context.value).toBe('jandupont+test@doe.fr');
  });

  test('email filter keeps the allowed characters', async () => {
    const context = { value: '' };
    component = await stage('email', context);
    expect(type('Jean.Dupont_2-x+y@doe-fr.com').value).toBe('Jean.Dupont_2-x+y@doe-fr.com');
  });

  test.each([
    '<input type="text"',
    '<input type="email"',
    '<input type="search"',
    '<input type="tel"',
    '<input type="url"',
    '<input type="password"',
    '<textarea'
  ])('filters %s> and updates the model', async control => {
    const context = { value: '' };
    component = await stage('email', context, control);
    expect(type('jean dupont@doe.fr').value).toBe('jeandupont@doe.fr');
    expect(context.value).toBe('jeandupont@doe.fr');
  });

  test('keeps the caret in place when a forbidden character is typed in the middle of the value', async () => {
    component = await stage('email', { value: '' });
    const input = type('jean!dupont@doe.fr', 5);
    expect(input.value).toBe('jeandupont@doe.fr');
    expect(input.selectionStart).toBe(4);
  });

  test('accepts a regular expression of the forbidden characters', async () => {
    const context = { value: '' };
    component = await stage('[^0-9]', context);
    type('a1b2c3');
    expect(context.value).toBe('123');
  });
});
