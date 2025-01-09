import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';

describe('hello-world element', () => {
  let component;

  afterEach(() => {
    if (component) {
      component.dispose();
      component = undefined;
    }
  });

  it('says hello world with message', async () => {
    const model = { message: 'from me' };

    component = StageComponent.withResources('elements/hello-world')
      .inView('<hello-world message.bind="message"></hello-world>')
      .boundTo(model);

    await component.create(bootstrap);
    const view = component.element;
    expect(view.textContent.trim()).toBe('Hello world from me');
  });
});
