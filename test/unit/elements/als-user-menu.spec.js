import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

/**
 * Dispatches a click on the target.
 * @param {Element} target clicked element
 * @returns {boolean} whether the default action was prevented
 */
function click(target) {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event.defaultPrevented;
}

/**
 * Presses a key on the target.
 * @param {Element} target focused element
 * @param {string} key key name
 */
function press(target, key) {
  target.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

describe('als-user-menu', () => {
  let component;
  const logout = jest.fn();

  beforeAll(() => {
    // bootstrap creates its events with the global classes: they must be jsdom's (window), not node's (global)
    /* eslint-disable unicorn/prefer-global-this */
    global.Event = window.Event;
    /* eslint-enable unicorn/prefer-global-this */
  });

  beforeEach(async () => {
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/als-dropdown/als-dropdown'),
      PLATFORM.moduleName('elements/als-user-menu/als-user-menu')
    ])
      .inView('<als-user-menu initials="UA" items.bind="items"></als-user-menu>')
      .boundTo({
        items: [
          { label: 'Mes informations', icon: 'bi-person', href: '#profil' },
          { label: 'Déconnexion', click: logout }
        ]
      });
    await component.create(bootstrap);
    await flush();
  });

  afterEach(() => component.dispose());

  test('displays the initials, the default label and the items', () => {
    const toggle = document.querySelector('.als-user-menu-toggle');
    expect(toggle.querySelector('.als-user-menu-avatar').textContent).toBe('UA');
    expect(toggle.textContent).toContain('Mon compte');

    const [link, action] = document.querySelectorAll('.als-user-menu-item');
    expect(link.textContent.trim()).toBe('Mes informations');
    expect(link.querySelector('i').classList).toContain('bi-person');
    expect(action.querySelector('i')).toBeNull();
  });

  test('a link item navigates, an action item is a button calling click', () => {
    const [link, action] = document.querySelectorAll('.als-user-menu-item');
    expect(link.tagName).toBe('A');
    expect(link.getAttribute('href')).toBe('#profil');
    // a button: activated by Enter and Space, unlike a link
    expect(action.tagName).toBe('BUTTON');
    expect(action.getAttribute('type')).toBe('button');

    expect(click(link)).toBe(false);
    expect(logout).not.toHaveBeenCalled();
    click(action);
    expect(logout).toHaveBeenCalledTimes(1);
  });

  test('the items are list items, reached with the arrows', async () => {
    const menu = document.querySelector('.dropdown-menu');
    expect([...menu.children].every(child => child.tagName === 'LI')).toBe(true);
    const toggle = document.querySelector('.als-user-menu-toggle');
    const [link, action] = document.querySelectorAll('.als-user-menu-item');

    press(toggle, 'ArrowDown');
    await flush();
    expect(document.activeElement).toBe(link);
    press(link, 'ArrowDown');
    expect(document.activeElement).toBe(action);
    // cycles
    press(action, 'ArrowDown');
    expect(document.activeElement).toBe(link);
    press(link, 'End');
    expect(document.activeElement).toBe(action);
    press(action, 'Home');
    expect(document.activeElement).toBe(link);
  });
});
