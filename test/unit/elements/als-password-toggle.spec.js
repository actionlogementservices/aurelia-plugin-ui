import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

describe('als-password-toggle', () => {
  let component;
  afterEach(() => component?.dispose());

  test('masks and reveals the password input of the same field', async () => {
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/forms/als-field/als-field'),
      PLATFORM.moduleName('elements/forms/als-password-toggle/als-password-toggle')
    ])
      .inView('<als-field><input type="password"><als-password-toggle></als-password-toggle></als-field>')
      .boundTo({});
    await component.create(bootstrap);
    const input = document.querySelector('input');
    const button = document.querySelector('button');
    expect(button.parentElement).toBe(input.parentElement);
    expect(button.getAttribute('aria-label')).toBe('Afficher le mot de passe');

    button.click();
    await flush();
    expect(input.type).toBe('text');
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('aria-label')).toBe('Masquer le mot de passe');

    button.click();
    await flush();
    expect(input.type).toBe('password');
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });
});
