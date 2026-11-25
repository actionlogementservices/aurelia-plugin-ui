import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Toast } from 'bootstrap';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));

describe('ToastService', () => {
  let component;
  /** @type {import('core/toast-service/toast-service').ToastService} */
  let service;

  beforeAll(() => {
    // bootstrap creates its events with the global classes: they must be jsdom's (window), not node's (global)
    /* eslint-disable unicorn/prefer-global-this */
    global.Event = window.Event;
    /* eslint-enable unicorn/prefer-global-this */
  });

  beforeEach(async () => {
    let aurelia;
    component = StageComponent.withResources([]).inView('<div></div>');
    component.bootstrap(au => {
      aurelia = au;
      au.use.standardConfiguration();
    });
    await component.create(bootstrap);
    // loaded by the aurelia loader, as in an application bundle, for the composition to find the view of the toast
    await aurelia.loader.loadModule('core/toast-service/toast');
    const { ToastService } = await aurelia.loader.loadModule('core/toast-service/toast-service');
    service = aurelia.container.get(ToastService);
  });

  afterEach(() => component.dispose());

  /**
   * Shows a toast and waits until it is displayed.
   * @param {'info' | 'success' | 'warning' | 'error'} type toast type
   * @param {string} message toast message
   * @param {number} [delay] delay before hiding the toast
   * @returns {Promise<{ closed: Promise<void>, toast: HTMLElement }>} closing promise and toast element
   */
  const show = async (type, message, delay) => {
    const closed = service[type](message, delay);
    await flush();
    const toast = [...document.querySelectorAll('#toastContainer .toast')].at(-1);
    return { closed, toast: /** @type {HTMLElement} */ (toast) };
  };

  test.each([
    ['info', 'bg-info', false],
    ['success', 'bg-success', true],
    ['warning', 'bg-warning', false],
    ['error', 'bg-danger', true]
  ])('%s: displays the message with the %s background', async (type, background, white) => {
    const { closed, toast } = await show(type, 'Message', 50);
    expect(toast.textContent.trim()).toBe('Message');
    expect(toast.classList).toContain(background);
    expect(toast.classList).toContain('show');
    expect(toast.classList.contains('text-white')).toBe(white);
    expect(toast.querySelector('.btn-close').classList.contains('btn-close-white')).toBe(white);
    expect(toast.getAttribute('role')).toBe('alert');
    await closed;
  });

  test('hides after 4 seconds by default', async () => {
    const { closed, toast } = await show('info', 'Message');
    expect(Toast.getInstance(toast)._config.delay).toBe(4000);
    toast.querySelector('button').click();
    await closed;
  });

  test('hides after the delay, removes the toast and resolves', async () => {
    const { closed, toast } = await show('success', 'Message', 50);
    await closed;
    expect(toast.isConnected).toBe(false);
    expect(document.querySelector('#toastContainer').children).toHaveLength(0);
  });

  test('closes before the delay with the close button and releases the bootstrap toast', async () => {
    const { closed, toast } = await show('error', 'Message', 10_000);
    toast.querySelector('button').click();
    await closed;
    expect(toast.isConnected).toBe(false);
    expect(Toast.getInstance(toast)).toBeNull();
  });

  test('stacks the toasts in a single container', async () => {
    const first = await show('info', 'Premier', 10_000);
    const second = await show('warning', 'Second', 10_000);
    expect(document.querySelectorAll('#toastContainer')).toHaveLength(1);
    expect(
      [...document.querySelectorAll('#toastContainer .toast')].map(toast => toast.textContent.trim())
    ).toEqual(['Premier', 'Second']);
    first.toast.querySelector('button').click();
    second.toast.querySelector('button').click();
    await Promise.all([first.closed, second.closed]);
  });
});
