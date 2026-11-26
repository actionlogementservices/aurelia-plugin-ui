import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

describe('loading-indicator', () => {
  let component;
  afterEach(() => component.dispose());

  /**
   * Renders the indicator.
   * @param {boolean} loading is there a call in progress?
   */
  const render = async loading => {
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/loading-indicator/loading-indicator')
    ])
      .inView('<loading-indicator loading.bind="loading"></loading-indicator>')
      .boundTo({ loading });
    await component.create(bootstrap);
  };

  test('is a named indeterminate progress bar while loading', async () => {
    await render(true);
    const bar = document.querySelector('[role="progressbar"]');
    expect(bar.getAttribute('aria-label')).toBe('Chargement en cours');
    // indeterminate: no value announced
    expect(bar.hasAttribute('aria-valuenow')).toBe(false);
  });

  test('displays nothing otherwise', async () => {
    await render(false);
    expect(document.querySelector('[role="progressbar"]')).toBeNull();
  });
});
