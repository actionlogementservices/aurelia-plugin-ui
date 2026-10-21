import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { AutoCompleteController } from 'elements/auto-complete/auto-complete-controller';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));
const datasource = () => [
  { id: 0, name: 'zero' },
  { id: 1, name: 'one' },
  { id: 2, name: 'two' },
  { id: 3, name: 'three' }
];
const attributes = 'value-key="id" label-key="name"';

/**
 * Stages a custom element and waits for the selection to settle.
 * @param {string} name custom element name
 * @param {string} bindings selection related attributes
 * @param {object} context binding context
 * @returns {Promise<any>} the staged component
 */
async function stage(name, bindings, context) {
  const folder = name.includes('auto-complete') ? 'auto-complete' : 'select';
  const component = StageComponent.withResources(PLATFORM.moduleName(`elements/${folder}/${name}`))
    .inView(`<${name} ${attributes} ${bindings}></${name}>`)
    .boundTo(context);
  await component.create(bootstrap);
  await flush();
  return component;
}

const inputValue = () => document.querySelector('input').value;

/**
 * Creates a controller whose `getItems` resolves after the specified delay for each value.
 * @param {object[]} items items to search in
 * @param {(values: any[]) => number} [delayOf] delay in ms for the specified values
 * @returns {AutoCompleteController} controller
 */
function createController(items, delayOf = () => 5) {
  const controller = new AutoCompleteController();
  controller.getItems = jest.fn(controller.getItems.bind(controller));
  controller.configure(
    async text => items.filter(item => item.name.includes(text)),
    undefined,
    async values => {
      await flush(delayOf(values));
      return items.filter(item => values.includes(item.id));
    }
  );
  return controller;
}

describe.each(['simple-select', 'filterable-select'])('%s', name => {
  let component;
  afterEach(() => component?.dispose());

  test('selected-value alone resolves the item, including value 0', async () => {
    const ds = datasource();
    const context = { ds, value: 0 };
    component = await stage(name, 'datasource.bind="ds" selected-value.bind="value"', context);
    expect(component.viewModel.selectedItem).toBe(ds[0]);
    expect(inputValue()).toBe('zero');
  });

  test('selected-value is kept until the datasource is loaded', async () => {
    const context = { ds: [], value: 2 };
    component = await stage(name, 'datasource.bind="ds" selected-value.bind="value"', context);
    expect(context.value).toBe(2);
    context.ds = datasource();
    await flush();
    expect(component.viewModel.selectedItem).toBe(context.ds[2]);
    expect(context.value).toBe(2);
    expect(inputValue()).toBe('two');
  });

  test('user selection updates selected-item and selected-value', async () => {
    const ds = datasource();
    const context = { ds, item: undefined, value: undefined };
    component = await stage(
      name,
      'datasource.bind="ds" selected-item.bind="item" selected-value.bind="value"',
      context
    );
    component.viewModel.selectItem(ds[3]);
    await flush();
    expect(context.item).toBe(ds[3]);
    expect(context.value).toBe(3);
    expect(inputValue()).toBe('three');
  });

  test('both two-way: parent changes are propagated to the other attribute', async () => {
    const ds = datasource();
    const context = { ds, item: ds[1], value: 1 };
    component = await stage(
      name,
      'datasource.bind="ds" selected-item.bind="item" selected-value.bind="value"',
      context
    );
    context.value = 2;
    await flush();
    expect(context.item).toBe(ds[2]);
    context.item = ds[3];
    await flush();
    expect(context.value).toBe(3);
    context.value = undefined;
    await flush();
    expect(context.item).toBeUndefined();
    expect(inputValue()).toBe('');
  });

  test('both two-way: consistent simultaneous parent changes are kept', async () => {
    const ds = datasource();
    const context = { ds, item: undefined, value: undefined };
    component = await stage(
      name,
      'datasource.bind="ds" selected-item.bind="item" selected-value.bind="value"',
      context
    );
    context.value = 1;
    context.item = ds[1];
    await flush();
    expect(context.item).toBe(ds[1]);
    expect(context.value).toBe(1);
  });

  test('two-way value with from-view item', async () => {
    const ds = datasource();
    const context = { ds, item: undefined, value: 1 };
    component = await stage(
      name,
      'datasource.bind="ds" selected-item.from-view="item" selected-value.bind="value"',
      context
    );
    expect(context.item).toBe(ds[1]);
    context.value = 2;
    await flush();
    expect(context.item).toBe(ds[2]);
  });
});

describe('badges-select', () => {
  let component;
  afterEach(() => component?.dispose());

  test('selected-values alone resolves the items in the values order', async () => {
    const ds = datasource();
    const context = { ds, values: [2, 0] };
    component = await stage('badges-select', 'datasource.bind="ds" selected-values.bind="values"', context);
    expect(component.viewModel.selectedItems).toEqual([ds[2], ds[0]]);
    expect(context.values).toEqual([2, 0]);
  });

  test('selected-values are kept until the datasource is loaded', async () => {
    const context = { ds: [], values: [1, 3] };
    component = await stage('badges-select', 'datasource.bind="ds" selected-values.bind="values"', context);
    expect(context.values).toEqual([1, 3]);
    context.ds = datasource();
    await flush();
    expect(component.viewModel.selectedItems).toEqual([context.ds[1], context.ds[3]]);
    expect(component.viewModel.filteredItems).toEqual([context.ds[0], context.ds[2]]);
  });

  test('both two-way: parent changes are propagated to the other attribute', async () => {
    const ds = datasource();
    const context = { ds, items: [], values: [] };
    component = await stage(
      'badges-select',
      'datasource.bind="ds" selected-items.bind="items" selected-values.bind="values"',
      context
    );
    context.values = [1, 2];
    await flush();
    expect(context.items).toEqual([ds[1], ds[2]]);
    context.items = [ds[3]];
    await flush();
    expect(context.values).toEqual([3]);
    component.viewModel.selectItem(ds[0]);
    await flush();
    expect(context.items).toEqual([ds[3], ds[0]]);
    expect(context.values).toEqual([3, 0]);
  });
});

describe('auto-complete', () => {
  let component;
  afterEach(() => component?.dispose());

  test('selected-value alone resolves the item through the controller, including value 0', async () => {
    const items = datasource();
    const context = { controller: createController(items), value: 0 };
    component = await stage(
      'auto-complete',
      'controller.bind="controller" selected-value.bind="value"',
      context
    );
    await flush();
    expect(component.viewModel.selectedItem).toBe(items[0]);
    expect(inputValue()).toBe('zero');
  });

  test('selected-value is resolved when the controller is bound afterwards', async () => {
    const items = datasource();
    const context = { controller: undefined, value: 2 };
    component = await stage(
      'auto-complete',
      'selected-value.bind="value" controller.bind="controller"',
      context
    );
    context.controller = createController(items);
    await flush();
    await flush();
    expect(component.viewModel.selectedItem).toBe(items[2]);
    expect(inputValue()).toBe('two');
  });

  test('an outdated resolution does not override a newer one', async () => {
    const items = datasource();
    const controller = createController(items, values => (values[0] === 1 ? 80 : 5));
    const context = { controller, value: undefined };
    component = await stage(
      'auto-complete',
      'controller.bind="controller" selected-value.bind="value"',
      context
    );
    context.value = 1;
    await flush(10);
    context.value = 2;
    await flush(150);
    expect(component.viewModel.selectedItem).toBe(items[2]);
    expect(context.value).toBe(2);
  });

  test('clearing the value does not query the controller', async () => {
    const items = datasource();
    const controller = createController(items);
    const context = { controller, value: 1 };
    component = await stage(
      'auto-complete',
      'controller.bind="controller" selected-value.bind="value"',
      context
    );
    await flush();
    controller.getItems.mockClear();
    context.value = undefined;
    await flush();
    expect(controller.getItems).not.toHaveBeenCalled();
    expect(component.viewModel.selectedItem).toBeUndefined();
    expect(inputValue()).toBe('');
  });

  test('a controller without getItems keeps the value', async () => {
    const controller = new AutoCompleteController();
    controller.configure(async () => []);
    const context = { controller, value: 1 };
    component = await stage(
      'auto-complete',
      'controller.bind="controller" selected-value.bind="value"',
      context
    );
    await flush();
    expect(context.value).toBe(1);
  });

  test('both two-way: parent item change updates the value', async () => {
    const items = datasource();
    const context = { controller: createController(items), item: undefined, value: undefined };
    component = await stage(
      'auto-complete',
      'controller.bind="controller" selected-item.bind="item" selected-value.bind="value"',
      context
    );
    context.item = items[3];
    await flush();
    expect(context.value).toBe(3);
    expect(context.controller.getItems).not.toHaveBeenCalled();
  });
});

describe('badges-auto-complete', () => {
  let component;
  afterEach(() => component?.dispose());

  test('selected-values alone resolves the items through the controller', async () => {
    const items = datasource();
    const context = { controller: createController(items), values: [3, 1] };
    component = await stage(
      'badges-auto-complete',
      'controller.bind="controller" selected-values.bind="values"',
      context
    );
    await flush();
    expect(component.viewModel.selectedItems).toEqual([items[3], items[1]]);
    expect(context.values).toEqual([3, 1]);
  });

  test('selected-values are resolved when the controller is bound afterwards', async () => {
    const items = datasource();
    const context = { controller: undefined, values: [2] };
    component = await stage(
      'badges-auto-complete',
      'selected-values.bind="values" controller.bind="controller"',
      context
    );
    context.controller = createController(items);
    await flush();
    await flush();
    expect(component.viewModel.selectedItems).toEqual([items[2]]);
  });

  test('selected-items set by the parent updates the values', async () => {
    const items = datasource();
    const context = { controller: createController(items), items: [], values: [] };
    component = await stage(
      'badges-auto-complete',
      'controller.bind="controller" selected-items.bind="items" selected-values.bind="values"',
      context
    );
    context.items = [items[0], items[2]];
    await flush();
    expect(context.values).toEqual([0, 2]);
  });

  test('an outdated resolution does not override a newer one', async () => {
    const items = datasource();
    const controller = createController(items, values => (values.includes(1) ? 80 : 5));
    const context = { controller, values: [] };
    component = await stage(
      'badges-auto-complete',
      'controller.bind="controller" selected-values.bind="values"',
      context
    );
    context.values = [1];
    await flush(10);
    context.values = [2];
    await flush(150);
    expect(component.viewModel.selectedItems).toEqual([items[2]]);
  });

  test('user selection updates the values', async () => {
    const items = datasource();
    const context = { controller: createController(items), values: [1] };
    component = await stage(
      'badges-auto-complete',
      'controller.bind="controller" selected-values.bind="values"',
      context
    );
    await flush();
    component.viewModel.selectItem(items[2]);
    await flush();
    expect(context.values).toEqual([1, 2]);
  });
});
