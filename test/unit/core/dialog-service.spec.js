import { Container } from 'aurelia-framework';
import { DialogService } from 'core/dialog-service/dialog-service';
import { DialogRenderer } from 'core/dialog-service/dialog-renderer';
import { DialogController } from 'core/dialog-service/dialog-controller';

/** view-model of the test dialogs, exposes its controller */
class TestDialog {
  static inject = [DialogController];
  constructor(controller) {
    this.controller = controller;
  }
}

/** composes the view-model in the host, as the aurelia composition engine does */
const compositionEngine = {
  async compose({ host, container, viewModel }) {
    host.innerHTML = '<div class="modal-dialog"><div class="modal-content"><button>Action</button></div></div>';
    const vm = container.invoke(viewModel);
    host.vm = vm;
    return { attached() {}, view: { unbind() {}, removeNodes() {} }, viewModel: vm };
  }
};

/**
 * Opens a test dialog and waits until bootstrap has shown it (focus moved in).
 * @param {DialogService} service dialog service
 * @returns {Promise<{ closed: Promise<any>, host: HTMLElement }>} result promise and host of the dialog
 */
const openDialog = async service => {
  const shown = new Promise(resolve =>
    document.addEventListener('shown.bs.modal', event => resolve(event.target), { once: true })
  );
  const closed = service.open({ viewModel: TestDialog });
  return { closed, host: await shown };
};

describe('DialogService', () => {
  /** @type {DialogService} */
  let service;
  let trigger;

  beforeAll(() => {
    // bootstrap creates its events with the global classes: they must be jsdom's (window), not node's (global)
    /* eslint-disable unicorn/prefer-global-this */
    global.Event = window.Event;
    /* eslint-enable unicorn/prefer-global-this */
  });

  beforeEach(() => {
    service = new DialogService(compositionEngine, new Container(), () => new DialogRenderer());
    trigger = document.createElement('button');
    document.body.append(trigger);
    trigger.focus();
  });

  afterEach(() => document.body.replaceChildren());

  test('stacks a second modal above the first one, each dialog with its own result', async () => {
    const { closed: formClosed, host: formHost } = await openDialog(service);
    const formButton = formHost.querySelector('button');
    formButton.focus();

    const { closed: infoClosed, host: infoHost } = await openDialog(service);
    expect(formHost.isConnected).toBe(true);
    expect(formHost.classList).toContain('show');
    expect(infoHost.classList).toContain('show');
    const backdrops = document.querySelectorAll('.modal-backdrop');
    expect(backdrops).toHaveLength(2);
    expect(infoHost.style.zIndex).toBe('1065');
    expect(backdrops[1].style.zIndex).toBe('1064');
    // the focus moves into the top dialog, the trap of the dialog below must not pull it back
    expect(infoHost.contains(document.activeElement)).toBe(true);

    infoHost.vm.controller.ok('info');
    expect(await infoClosed).toEqual(expect.objectContaining({ wasCancelled: false, output: 'info' }));
    expect(infoHost.isConnected).toBe(false);
    expect(formHost.classList).toContain('show');
    expect(document.activeElement).toBe(formButton);

    // closed with Escape: no controller call, the result of the info dialog must not leak
    formHost.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(await formClosed).toEqual(expect.objectContaining({ wasCancelled: true, output: undefined }));
    expect(formHost.isConnected).toBe(false);
    expect(document.querySelectorAll('.modal-backdrop')).toHaveLength(0);
    expect(document.activeElement).toBe(trigger);
  });

  test('keeps the focus in the top dialog when the dialog below closes', async () => {
    const { closed: formClosed, host: formHost } = await openDialog(service);
    const { closed: infoClosed, host: infoHost } = await openDialog(service);
    const infoButton = infoHost.querySelector('button');
    infoButton.focus();

    formHost.vm.controller.cancel();
    expect(await formClosed).toEqual(expect.objectContaining({ wasCancelled: true }));
    expect(document.activeElement).toBe(infoButton);
    infoHost.vm.controller.cancel();
    await infoClosed;
  });

  test('stacks dialogs opened by two components with their own service instance', async () => {
    const otherService = new DialogService(compositionEngine, new Container(), () => new DialogRenderer());
    const { closed: formClosed, host: formHost } = await openDialog(service);
    const { closed: infoClosed, host: infoHost } = await openDialog(otherService);
    expect(formHost.classList).toContain('show');
    expect(infoHost.style.zIndex).toBe('1065');

    infoHost.vm.controller.ok();
    await infoClosed;
    expect(formHost.isConnected).toBe(true);
    expect(formHost.classList).toContain('show');
    formHost.vm.controller.cancel();
    await formClosed;
  });
});
