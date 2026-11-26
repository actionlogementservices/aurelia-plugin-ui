import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { AureliaConfiguration } from 'aurelia-configuration';

// the validation rules of the Adresse model are out of scope, and their accessors can't be parsed once instrumented
jest.mock('elements/auto-complete/adresse', () => ({ Adresse: class {} }));

const flush = () => new Promise(resolve => setTimeout(resolve));

describe('address-auto-complete', () => {
  let component;

  beforeAll(() => {
    // the BAN api is not queried: the http client only needs a fetch implementation
    global.fetch ??= jest.fn();
  });

  beforeEach(async () => {
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/auto-complete/address-auto-complete'),
      PLATFORM.moduleName('elements/auto-complete/auto-complete')
    ])
      .inView('<address-auto-complete value.bind="value" manual-entry="true"></address-auto-complete>')
      .boundTo({ value: { isAddressNotListed: true } });
    component.bootstrap(aurelia => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(AureliaConfiguration, { get: () => 'https://ban.test' });
    });
    await component.create(bootstrap);
    await flush();
  });

  afterEach(() => component.dispose());

  test('labels every input of the manual entry, the city one being the search input of its auto-complete', () => {
    for (const label of document.querySelectorAll('label')) {
      const input = document.getElementById(label.getAttribute('for'));
      expect(input?.tagName).toBe('INPUT');
    }
    const city = [...document.querySelectorAll('label')].find(label => label.textContent.includes('Commune'));
    expect(document.getElementById(city.getAttribute('for')).getAttribute('role')).toBe('combobox');
  });

  test('tells the required fields to the screen readers, the marker being hidden', () => {
    const required = [...document.querySelectorAll('label')].filter(label => label.querySelector('.text-danger'));
    expect(required.map(label => label.textContent.replaceAll(/\s+/g, ' ').trim())).toEqual([
      'Nom de la voie * (obligatoire)',
      'Commune * (obligatoire)'
    ]);
    for (const label of required) {
      expect(label.querySelector('.text-danger').getAttribute('aria-hidden')).toBe('true');
    }
  });
});
