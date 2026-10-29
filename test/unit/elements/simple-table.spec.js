import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { DOM, PLATFORM } from 'aurelia-pal';
import { SimpleTable } from '../../../src/elements/simple-table/simple-table';

const taskQueue = { queueTask: jest.fn(), queueMicroTask: jest.fn() };
const items = Array.from({ length: 25 }, (_, id) => ({ id }));

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));
const ds = length => Array.from({ length }, (_, id) => ({ id }));
const select = () => document.querySelector('simple-table select');
const rowCount = () => document.querySelectorAll('simple-table tbody tr').length;

/**
 * Stages a simple-table with an id column.
 * @param {string} bindings table attributes
 * @param {object} context binding context
 * @returns {Promise<any>} the staged component
 */
async function stage(bindings, context) {
  const component = StageComponent.withResources([
    PLATFORM.moduleName('elements/simple-table/simple-table'),
    PLATFORM.moduleName('elements/simple-table/column')
  ])
    .inView(`<simple-table ${bindings}><column header="Id" cell-key="id"></column></simple-table>`)
    .boundTo(context);
  await component.create(bootstrap);
  await flush();
  return component;
}

const createTable = () => {
  const table = new SimpleTable(document.createElement('div'), taskQueue);
  table.paginated = true;
  table.maxRows = '10'; // plain attribute value
  table.datasource = items;
  table.setDisplayedItems();
  return table;
};

describe('simple-table pagination', () => {
  test('displays the current page', () => {
    const table = createTable();
    expect(table.pageCount).toBe(3);
    table.page = 3;
    table.setDisplayedItems();
    expect(table.items.map(item => item.id)).toEqual([20, 21, 22, 23, 24]);
  });

  test('goToPage() clamps to existing pages', () => {
    const table = createTable();
    table.goToPage(9);
    expect(table.page).toBe(3);
    table.goToPage(0);
    expect(table.page).toBe(1);
  });

  test('pages shows first, last, current ±1 and ellipsis', () => {
    const table = createTable();
    table.datasource = Array.from({ length: 100 }, (_, id) => ({ id }));
    table.setDisplayedItems();
    table.page = 5;
    expect(table.pages).toEqual([1, undefined, 4, 5, 6, undefined, 10]);
    table.page = 1;
    expect(table.pages).toEqual([1, 2, undefined, 10]);
  });

  test('sorting a paginated array sorts the whole datasource', () => {
    const table = createTable();
    table.page = 2;
    table.sortDisplayedItems({ cellKey: 'id', sortable: true, sortType: 'numeric', sortOrder: 'asc' });
    expect(table.page).toBe(1);
    expect(table.items[0].id).toBe(24);
  });

  test('changePageSize() resizes pages and restarts from the first one', () => {
    const table = createTable();
    table.page = 3;
    table.changePageSize('20');
    expect(table.maxRows).toBe(20);
    expect(table.page).toBe(1);
    expect(table.pageCount).toBe(2);
    expect(table.items).toHaveLength(20);
  });

  test('default page size is 10 when paginated, 50 otherwise', () => {
    const table = new SimpleTable(document.createElement('div'), taskQueue);
    expect(table.pageSize).toBe(50);
    table.paginated = true;
    expect(table.pageSize).toBe(10);
  });

  test('a { items, totalCount } datasource is the current page loaded by the parent', () => {
    const table = createTable();
    table.page = 2;
    table.datasource = { items: items.slice(10, 20), totalCount: 25 };
    table.datasourceChanged();
    expect(table.page).toBe(2);
    expect(table.pageCount).toBe(3);
    expect(table.items.map(item => item.id)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  });
});

describe('simple-table selection', () => {
  const click = (tagName = 'td') => ({ target: document.createElement(tagName) });

  /**
   * Creates a table of 3 fresh items, the second one being disabled.
   * @param {'none' | 'single' | 'multiple'} selectionMode selection mode
   * @returns {SimpleTable} table
   */
  const createSelectionTable = selectionMode => {
    const table = new SimpleTable(document.createElement('div'), taskQueue);
    Object.assign(table, { selectionMode, valueKey: 'id', disableableRows: true });
    table.datasource = [0, 1, 2].map(id => ({ id, disabled: id === 1 }));
    table.setDisplayedItems();
    return table;
  };

  test('multiple: clicks toggle items, disabled rows and inner buttons are ignored', () => {
    const table = createSelectionTable('multiple');
    const [first, disabled, last] = table.items;
    table.toggleItemSelection(first, click());
    table.toggleItemSelection(last, click());
    table.toggleItemSelection(disabled, click());
    table.toggleItemSelection(first, click('button'));
    expect(table.selectedItems).toEqual([first, last]);
    expect(table.items.map(item => !!item.selected)).toEqual([true, false, true]);
    table.toggleItemSelection(first, click());
    expect(table.selectedItems).toEqual([last]);
  });

  test('single: selecting an item replaces the previous one', () => {
    const table = createSelectionTable('single');
    const [first, , last] = table.items;
    table.toggleItemSelection(first, click());
    table.toggleItemSelection(last, click());
    expect(table.selectedItems).toEqual([last]);
  });

  test('none: clicks select nothing', () => {
    const table = createSelectionTable('none');
    table.toggleItemSelection(table.items[0], click());
    expect(table.selectedItems).toEqual([]);
  });

  test('toggleAllSelection() selects every enabled item then unselects them', () => {
    const table = createSelectionTable('multiple');
    expect(table.selectableItemCount).toBe(2);
    table.toggleAllSelection();
    expect(table.selectedItems.map(item => item.id)).toEqual([0, 2]);
    table.toggleAllSelection();
    expect(table.selectedItems).toEqual([]);
  });
});

describe('simple-table page size selector', () => {
  let component;
  afterEach(() => component?.dispose());

  test('is not displayed without pagination', async () => {
    component = await stage('datasource.bind="ds"', { ds: ds(25) });
    expect(select()).toBeNull();
  });

  test('is displayed with pagination, 10 being the default', async () => {
    component = await stage('datasource.bind="ds" paginated="true"', { ds: ds(25) });
    expect([...select().options].map(option => option.value)).toEqual(['10', '20', '50', '100']);
    expect(select().value).toBe('10');
    expect(rowCount()).toBe(10);
    expect(document.querySelector('simple-table nav')).not.toBeNull();
  });

  test('stays displayed on a single page, the pagination being hidden', async () => {
    component = await stage('datasource.bind="ds" paginated="true"', { ds: ds(5) });
    expect(select()).not.toBeNull();
    expect(document.querySelector('simple-table nav')).toBeNull();
  });

  test('user change resizes the page and updates the parent', async () => {
    const context = { ds: ds(25), page: 3, size: undefined };
    component = await stage(
      'datasource.bind="ds" paginated="true" page.bind="page" max-rows.bind="size"',
      context
    );
    select().value = '20';
    select().dispatchEvent(DOM.createCustomEvent('change', { bubbles: true }));
    await flush();
    expect(context.size).toBe(20);
    expect(context.page).toBe(1);
    expect(rowCount()).toBe(20);
  });
});
