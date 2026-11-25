import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DOM, PLATFORM } from 'aurelia-pal';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

describe('input-mask', () => {
  let component;
  let model;

  /**
   * Stages an input masked with the specified type, bound to `model.value` through `formInputNumberFormat`.
   * @param {string} type mask type
   * @param {number} [value] initial value of the model
   * @returns {Promise<HTMLInputElement>} the input
   */
  const stage = async (type, value) => {
    model = { value };
    component = StageComponent.withResources([
      PLATFORM.moduleName('attributes/input-mask'),
      PLATFORM.moduleName('value-converters/form-input-number-format')
    ])
      .inView(`<input input-mask="${type}" value.bind="model.value | formInputNumberFormat:'${type}'" />`)
      .boundTo({ model });
    await component.create(bootstrap);
    await flush();
    return document.querySelector('input');
  };

  afterEach(() => component.dispose());

  test.each([
    ['integer', 1_234_567, '1 234 567'],
    ['decimal', 1234.5, '1 234,5'],
    ['currency', 2500, '2 500']
  ])('%s: displays %d as %p and updates the model with the typed number', async (type, value, text) => {
    const input = await stage(type);
    input.value = String(value).replace('.', ',');
    input.dispatchEvent(DOM.createCustomEvent('input', { bubbles: true }));
    await flush();
    expect(input.value).toBe(text);
    expect(model.value).toBe(value);
  });

  test('formats the initial value of the model', async () => {
    const input = await stage('currency', 1234);
    expect(input.value).toBe('1 234');
  });

  test.each([
    ['integer', '-5', '5'],
    ['integer', '12a3', '123'],
    ['decimal', '12,345', '12,35'],
    ['percentage', '150', '100'],
    ['percentage', '12,55', '12,6']
  ])('%s: masks %p as %p', async (type, value, text) => {
    const input = await stage(type);
    /** @type {any} */ (input).inputmask.setValue(value);
    expect(input.value).toBe(text);
  });
});
