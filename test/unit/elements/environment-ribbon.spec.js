import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

describe('environment-ribbon', () => {
  let component;

  /**
   * Renders the ribbon.
   * @param {object} [environment] environment descriptor
   */
  const render = async environment => {
    component = StageComponent.withResources([PLATFORM.moduleName('elements/environment-ribbon/environment-ribbon')])
      .inView('<environment-ribbon environment.one-time="environment" position="bottom-right"></environment-ribbon>')
      .boundTo({ environment });
    await component.create(bootstrap);
  };

  afterEach(() => component.dispose());

  test('displays the name of the environment, colored by its type, in the corner', async () => {
    await render({ name: 'RECETTE', type: 'Recette' });
    const ribbon = document.querySelector('.er');
    expect(ribbon.textContent).toBe('RECETTE');
    expect([...ribbon.classList]).toEqual(expect.arrayContaining(['er-recette', 'er-bottom', 'er-right']));
  });

  test('displays nothing without environment', async () => {
    await render(undefined);
    expect(document.querySelector('.er')).toBeNull();
  });
});
