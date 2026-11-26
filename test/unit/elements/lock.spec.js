import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

const flush = () => new Promise(resolve => setTimeout(resolve));

describe('lock', () => {
  let component;
  let context;

  beforeEach(async () => {
    context = { locked: false };
    component = StageComponent.withResources([PLATFORM.moduleName('elements/lock/lock')])
      .inView('<div><lock locked.bind="locked"></lock><div id="content"><button id="save">Enregistrer</button></div></div>')
      .boundTo(context);
    await component.create(bootstrap);
  });

  afterEach(() => component.dispose());

  test('makes the rest of the page inert and announces the wait while locked', async () => {
    const status = document.querySelector('[role="status"]');
    const content = document.querySelector('#content');
    expect(status.textContent).toBe('');
    expect(content.hasAttribute('inert')).toBe(false);

    context.locked = true;
    await flush();
    expect(status.textContent).toBe('Veuillez patienter.');
    expect(content.hasAttribute('inert')).toBe(true);
    expect(document.querySelector('lock').closest('[inert]')).toBeNull();

    context.locked = false;
    await flush();
    expect(status.textContent).toBe('');
    expect(document.querySelectorAll('[inert]')).toHaveLength(0);
  });

  test('gives the focus back to the element that had it', async () => {
    const save = document.querySelector('#save');
    save.focus();
    context.locked = true;
    await flush();
    // a browser blurs the focused element when it becomes inert
    save.blur();

    context.locked = false;
    await flush();
    expect(document.activeElement).toBe(save);
  });

  test('keeps an element made inert by the application inert on unlock', async () => {
    const content = document.querySelector('#content');
    content.toggleAttribute('inert', true);
    context.locked = true;
    await flush();
    context.locked = false;
    await flush();
    expect(content.hasAttribute('inert')).toBe(true);
  });
});
