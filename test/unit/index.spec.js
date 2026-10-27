import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { validationMessages } from 'aurelia-validation';

import { configure } from '../../src/index';

const mockAurelia = { globalResources: jest.fn(() => {}) };

describe('index', () => {
  test('configure() registers custom elements globally', () => {
    configure(mockAurelia);
    expect(mockAurelia.globalResources).toHaveBeenCalled();
  });

  test('configure() translates the aurelia-validation messages', () => {
    configure(mockAurelia);
    expect(validationMessages.required).toBe('Ce champ est obligatoire.');
  });

  test('attributes and value converters load without a view', async () => {
    configure(mockAurelia);
    /** @type {string[]} */
    const resources = mockAurelia.globalResources.mock.calls[0][0]
      .filter(resource => /^\.\/(attributes|value-converters)\//.test(resource))
      .map(resource => resource.slice(2));
    // a module exporting a plain function is analyzed as a custom element, whose missing view fails to load
    const component = StageComponent.withResources(resources).inView(
      '<div>${1234 | formInputNumberFormat}</div>'
    );
    await component.create(bootstrap);
    expect(document.querySelector('div').textContent).toBe('1 234');
    component.dispose();
  });
});
