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

describe('als-user-menu', () => {
  let component;
  const logout = jest.fn();

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

  test('a link item navigates, an action item calls click without navigating', () => {
    const [link, action] = document.querySelectorAll('.als-user-menu-item');
    expect(link.getAttribute('href')).toBe('#profil');
    expect(link.getAttribute('role')).toBeNull();
    expect(action.getAttribute('role')).toBe('button');

    expect(click(link)).toBe(false);
    expect(logout).not.toHaveBeenCalled();
    expect(click(action)).toBe(true);
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
