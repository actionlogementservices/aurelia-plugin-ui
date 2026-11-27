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

  test('sorting a paginated array sorts the whole datasource, from the first page', () => {
    const table = createTable();
    const column = { cellKey: 'id', sortable: true, sortType: 'numeric' };
    table.columns = [column];
    table.page = 2;
    table.sortDisplayedItems(column);
    expect(table.sort).toEqual({ key: 'id', order: 'asc' });
    expect(column.sortOrder).toBe('asc');
    table.sortDisplayedItems(column);
    expect(table.sort).toEqual({ key: 'id', order: 'desc' });
    expect(table.page).toBe(1);
    expect(table.items[0].id).toBe(24);
  });

  test('sorting an array without pagination sorts the rows beyond the displayed ones too', () => {
    const table = new SimpleTable(document.createElement('div'), taskQueue);
    const column = { cellKey: 'id', sortable: true, sortType: 'numeric' };
    Object.assign(table, { columns: [column], maxRows: 10, datasource: items });
    table.setDisplayedItems();
    table.sortDisplayedItems(column);
    table.sortDisplayedItems(column);
    expect(table.items.map(item => item.id)).toEqual([24, 23, 22, 21, 20, 19, 18, 17, 16, 15]);
  });

  test('a { items, totalCount } datasource: a sort restarts from the first page, reloaded by the parent', () => {
    const table = createTable();
    const column = { cellKey: 'id', sortable: true, sortType: 'numeric' };
    table.columns = [column];
    table.datasource = { items: items.slice(10, 20), totalCount: 25 };
    table.page = 2;
    table.setDisplayedItems();
    table.sortDisplayedItems(column);
    table.sortDisplayedItems(column);
    expect(table.page).toBe(1);
    // the displayed page is sorted in memory until the parent reloads it
    expect(table.items[0].id).toBe(19);
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
    expect(table.items.map(item => table.selectedKeys.has(item.id))).toEqual([true, false, true]);
    // the data of the application is left untouched
    expect(table.items.some(item => Object.hasOwn(item, 'selected'))).toBe(false);
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

  test('toggleAllSelection() selects the rows of the page, keeping the selection of the other pages', () => {
    const table = new SimpleTable(document.createElement('div'), taskQueue);
    Object.assign(table, { selectionMode: 'multiple', valueKey: 'id', paginated: true, maxRows: 10 });
    table.datasource = ds(25);
    table.setDisplayedItems();
    table.toggleSelection(table.items[0]);
    table.goToPage(2);
    table.setDisplayedItems();
    expect(table.pageSelectedCount).toBe(0);

    table.toggleAllSelection();
    expect(table.selectedItems.map(item => item.id)).toEqual([0, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
    expect(table.pageSelectedCount).toBe(10);
    table.toggleAllSelection();
    expect(table.selectedItems.map(item => item.id)).toEqual([0]);
  });

  test('a row of a page reloaded by the parent is unselected by its key', () => {
    const table = new SimpleTable(document.createElement('div'), taskQueue);
    Object.assign(table, { selectionMode: 'multiple', valueKey: 'id' });
    table.datasource = { items: ds(3), totalCount: 30 };
    table.setDisplayedItems();
    table.toggleSelection(table.items[1]);
    // the parent loads the page again: new objects
    table.datasource = { items: ds(3), totalCount: 30 };
    table.setDisplayedItems();
    expect(table.selectedKeys.has(table.items[1].id)).toBe(true);
    expect(table.pageSelectedCount).toBe(1);
    table.toggleSelection(table.items[1]);
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
    // labelled by the label wrapping it, the text before the select
    expect(select().closest('label').firstElementChild.textContent).toBe('Éléments par page');
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
    const context = { ds: ds(25), page: 3, size: undefined, changes: [] };
    component = await stage(
      'datasource.bind="ds" paginated="true" page.bind="page" max-rows.bind="size" change.trigger="changes.push($event.detail)"',
      context
    );
    select().value = '20';
    select().dispatchEvent(DOM.createCustomEvent('change', { bubbles: true }));
    await flush();
    expect(context.size).toBe(20);
    expect(context.page).toBe(1);
    expect(rowCount()).toBe(20);
    // the change event of the table carries the selection: the one of the page size selector stays inside
    expect(context.changes).toEqual([]);
  });
});

describe('simple-table accessibility', () => {
  let component;
  afterEach(() => component?.dispose());

  const checkboxes = () => [...document.querySelectorAll('simple-table input[type="checkbox"]')];

  test('selects the rows with named checkboxes, the "select all" one being mixed on a partial selection', async () => {
    const context = { ds: ds(3), selected: [], changes: [] };
    component = await stage(
      'datasource.bind="ds" selection-mode="multiple" value-key="id" selected-items.bind="selected" change.trigger="changes.push($event.detail)"',
      context
    );
    const [all, first, second] = checkboxes();
    expect(all.getAttribute('aria-label')).toBe('Tout sélectionner');
    expect(first.getAttribute('aria-label')).toBe('Sélectionner la ligne 1');

    first.click();
    await flush();
    expect(context.selected).toEqual([context.ds[0]]);
    expect(first.checked).toBe(true);
    // selection state in the primary color, like the checked checkbox
    expect(first.closest('tr').classList).toContain('table-primary');
    expect(all.indeterminate).toBe(true);
    // the change event of the table carries the selection, the one of the checkbox stays inside
    expect(context.changes).toEqual([[context.ds[0]]]);

    all.click();
    await flush();
    expect(context.selected).toEqual(context.ds);
    expect(all.checked).toBe(true);
    expect(all.indeterminate).toBe(false);
    expect(second.checked).toBe(true);

    first.click();
    await flush();
    expect(context.selected).toEqual(context.ds.slice(1));
  });

  test('displays the row count above the table, in a status announced by the screen readers', async () => {
    const context = { ds: ds(25), selected: [] };
    component = await stage(
      'datasource.bind="ds" paginated="true" selection-mode="multiple" value-key="id" selected-items.bind="selected"',
      context
    );
    const status = document.querySelector('simple-table [role="status"]');
    // out of the table: not read as the header of every column
    expect(status.closest('table')).toBeNull();
    expect(status.textContent.trim()).toBe('1–10 sur 25 résultat(s).');
    expect(document.querySelectorAll('simple-table thead tr')).toHaveLength(1);

    checkboxes()[1].click();
    await flush();
    expect(status.parentElement.textContent).toContain('1 sélectionné(s)');

    document.querySelector('simple-table [aria-label="Page suivante"]').click();
    await flush();
    expect(status.textContent.trim()).toBe('11–20 sur 25 résultat(s).');
  });

  test('warns when not all the rows are displayed, and hides the detail bar on demand', async () => {
    component = await stage('datasource.bind="ds" max-rows="10"', { ds: ds(25) });
    expect(document.querySelector('simple-table [role="status"]').textContent.trim()).toBe('25 résultat(s).');
    expect(document.querySelector('simple-table .text-warning-emphasis').textContent.trim()).toBe(
      'Seuls les 10 premiers résultats sont affichés.'
    );
    component.dispose();

    component = await stage('datasource.bind="ds" no-row-count-header="true"', { ds: ds(3) });
    expect(document.querySelector('simple-table [role="status"]')).toBeNull();
  });

  test('selects the rows of every page from the detail bar, then clears them', async () => {
    const context = { ds: ds(25), selected: [] };
    component = await stage(
      'datasource.bind="ds" paginated="true" selection-mode="multiple" value-key="id" selected-items.bind="selected"',
      context
    );
    const button = text =>
      [...document.querySelectorAll('simple-table button.btn-link')].find(b => b.textContent.trim() === text);
    expect(button('Sélectionner les 25 résultats')).toBeUndefined();

    const announce = document.querySelectorAll('simple-table [role="status"]')[1];
    expect(announce.textContent.trim()).toBe('');
    checkboxes()[0].click();
    await flush();
    // announced: the button appears before the table, above the focused checkbox
    expect(announce.textContent.trim()).toBe(
      'Toutes les lignes de la page sont sélectionnées. Bouton « Sélectionner les 25 résultats » disponible au-dessus du tableau.'
    );
    button('Sélectionner les 25 résultats').click();
    await flush();
    expect(context.selected).toHaveLength(25);
    expect(button('Sélectionner les 25 résultats')).toBeUndefined();
    expect(announce.textContent.trim()).toBe('');
    // the focus goes to the button replacing the clicked one
    expect(document.activeElement).toBe(button('Effacer la sélection'));

    button('Effacer la sélection').click();
    await flush();
    expect(context.selected).toEqual([]);
    expect(document.activeElement).toBe(checkboxes()[0]);
  });

  test('tells that the disabled rows are left out of every page, and takes custom texts', async () => {
    const context = { ds: ds(25).map(item => ({ ...item, disabled: item.id === 24 })), selected: [] };
    component = await stage(
      'datasource.bind="ds" paginated="true" selection-mode="multiple" value-key="id" disableable-rows="true" selected-items.bind="selected" select-page-text="Toute la page" select-row-text="Ligne {row}"',
      context
    );
    const [all, first] = checkboxes();
    expect(all.getAttribute('aria-label')).toBe('Toute la page');
    expect(first.getAttribute('aria-label')).toBe('Ligne 1');

    all.click();
    await flush();
    const texts = [...document.querySelectorAll('simple-table button.btn-link')].map(button =>
      button.textContent.trim()
    );
    expect(texts).toContain('Sélectionner les 24 résultats sélectionnables');
  });

  test('the sort-order of a column is the initial sort, and the sort bound by the parent sorts the rows', async () => {
    const context = { ds: ds(3), sort: undefined };
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/simple-table/simple-table'),
      PLATFORM.moduleName('elements/simple-table/column')
    ])
      .inView(
        '<simple-table datasource.bind="ds" sort.bind="sort"><column header="Id" cell-key="id" sortable="true" sort-type="numeric" sort-order="desc"></column></simple-table>'
      )
      .boundTo(context);
    await component.create(bootstrap);
    await flush();
    const ids = () =>
      [...document.querySelectorAll('simple-table tbody td')].map(td => td.textContent.trim());
    expect(context.sort).toEqual({ key: 'id', order: 'desc' });
    expect(ids()).toEqual(['2', '1', '0']);
    expect(document.querySelector('simple-table th[scope="col"]').getAttribute('aria-sort')).toBe(
      'descending'
    );

    context.sort = { key: 'id', order: 'asc' };
    await flush();
    expect(ids()).toEqual(['0', '1', '2']);
    expect(document.querySelector('simple-table th[scope="col"]').getAttribute('aria-sort')).toBe(
      'ascending'
    );
  });

  test('is named by its caption, displayed above the table or hidden', async () => {
    component = await stage('datasource.bind="ds" caption="Contrats en cours"', { ds: ds(3) });
    const table = () => document.querySelector('simple-table table');
    const title = document.getElementById(table().getAttribute('aria-labelledby'));
    expect(title.textContent.trim()).toBe('Contrats en cours');
    // above the detail bar, not a <caption> coming below it
    expect(title.compareDocumentPosition(table()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    component.dispose();

    component = await stage('datasource.bind="ds" caption="Contrats en cours" hide-caption="true"', {
      ds: ds(3)
    });
    expect(table().getAttribute('aria-label')).toBe('Contrats en cours');
    expect(table().hasAttribute('aria-labelledby')).toBe(false);
    expect(document.body.textContent).not.toContain('Contrats en cours');
  });

  test('tells the loading of the rows, keeping the controls focusable', async () => {
    const context = { ds: ds(25), loading: true };
    component = await stage('datasource.bind="ds" paginated="true" loading.bind="loading"', context);
    const table = document.querySelector('simple-table table');
    const status = document.querySelector('simple-table [role="status"]');
    expect(table.getAttribute('aria-busy')).toBe('true');
    expect(table.classList).toContain('table-disabled');
    expect(status.textContent.trim()).toBe('Chargement en cours');
    // a disabled control would lose the keyboard focus
    expect(document.querySelector('simple-table [aria-label="Page suivante"]').disabled).toBe(false);

    context.loading = false;
    await flush();
    expect(table.hasAttribute('aria-busy')).toBe(false);
    expect(status.textContent.trim()).toBe('1–10 sur 25 résultat(s).');
  });

  test('offers the page sizes set by the application', async () => {
    component = await stage('datasource.bind="ds" paginated="true" page-sizes.bind="[5, 25]"', {
      ds: ds(30)
    });
    expect([...select().options].map(option => option.value)).toEqual(['5', '25']);
  });

  test('tells the sort order of the sorted column to the screen readers', async () => {
    component = StageComponent.withResources([
      PLATFORM.moduleName('elements/simple-table/simple-table'),
      PLATFORM.moduleName('elements/simple-table/column')
    ])
      .inView(
        '<simple-table datasource.bind="ds"><column header="Id" cell-key="id" sortable="true"></column><column header="Nom"></column></simple-table>'
      )
      .boundTo({ ds: ds(3) });
    await component.create(bootstrap);
    await flush();
    const [id, name] = document.querySelectorAll('simple-table th[scope="col"]');
    expect(id.hasAttribute('aria-sort')).toBe(false);

    id.querySelector('button').click();
    await flush();
    expect(id.getAttribute('aria-sort')).toBe('ascending');
    id.querySelector('button').click();
    await flush();
    expect(id.getAttribute('aria-sort')).toBe('descending');
    expect(name.hasAttribute('aria-sort')).toBe(false);
  });
});

describe('simple-table search', () => {
  let component;
  afterEach(() => component?.dispose());

  const people = ['Élodie Martin', 'Bruno Petit', 'Éloïse Durand', 'Chloé Leroy', 'Paul Elouan'].map(
    (name, id) => ({
      id,
      name
    })
  );
  const names = () =>
    [...document.querySelectorAll('simple-table tbody td:last-child')].map(td => td.textContent.trim());
  const status = () => document.querySelector('simple-table [role="status"]').textContent.trim();
  const field = () => document.querySelector('simple-table input[type="search"]');
  const type = async text => {
    field().value = text;
    field().dispatchEvent(new window.Event('input', { bubbles: true }));
    // debounced
    await flush(350);
  };

  /**
   * Stages a simple-table with an id and a name column.
   * @param {string} bindings table attributes
   * @param {object} context binding context
   * @returns {Promise<any>} the staged component
   */
  const stagePeople = async (bindings, context) => {
    const staged = StageComponent.withResources([
      PLATFORM.moduleName('elements/simple-table/simple-table'),
      PLATFORM.moduleName('elements/simple-table/column')
    ])
      .inView(
        `<simple-table ${bindings}><column header="Id" cell-key="id"></column><column header="Nom" cell-key="name"></column></simple-table>`
      )
      .boundTo(context);
    await staged.create(bootstrap);
    await flush();
    return staged;
  };

  test('a table without search has no field, and displays every row', async () => {
    component = await stagePeople('datasource.bind="ds"', { ds: people });
    expect(field()).toBeNull();
    expect(names()).toEqual(people.map(person => person.name));
    expect(status()).toBe('5 résultat(s).');
  });

  test('filters the rows on the cell-keys, without case nor accents, from the first page', async () => {
    const context = { ds: people, search: undefined, page: 1 };
    component = await stagePeople(
      'datasource.bind="ds" searchable="true" search.bind="search" paginated="true" max-rows="2" page.bind="page"',
      context
    );
    expect(field().closest('label').textContent).toContain('Rechercher dans le tableau');
    document.querySelector('simple-table [aria-label="Page suivante"]').click();
    await flush();
    expect(context.page).toBe(2);

    await type('ELO');
    expect(context.search).toBe('ELO');
    expect(context.page).toBe(1);
    expect(names()).toEqual(['Élodie Martin', 'Éloïse Durand']);
    expect(status()).toBe('1–2 sur 3 résultat(s).');

    // a single page: the count without range
    await type('Bruno');
    expect(status()).toBe('1 résultat(s).');

    await type('zzz');
    expect(document.querySelector('simple-table tbody').textContent.trim()).toBe(
      'Aucun résultat pour « zzz »'
    );
    // announced by the screen readers, the empty table not being a status
    expect(status()).toBe('Aucun résultat pour « zzz »');

    await type('');
    expect(status()).toBe('1–2 sur 5 résultat(s).');
  });

  test('applies the search-filter rule of the application', async () => {
    const context = { ds: people, search: 'b', byId: (person, search) => String(person.id) === search };
    component = await stagePeople(
      'datasource.bind="ds" search.bind="search" search-filter.bind="byId"',
      context
    );
    expect(names()).toEqual(['Aucun résultat pour « b »']);
    context.search = '3';
    await flush();
    expect(names()).toEqual(['Chloé Leroy']);
  });

  test('keeps the selection hidden by the search, and selects every result of the search', async () => {
    const context = { ds: people, search: undefined, selected: [] };
    component = await stagePeople(
      'datasource.bind="ds" searchable="true" search.bind="search" selection-mode="multiple" value-key="id" selected-items.bind="selected" paginated="true" max-rows="2"',
      context
    );
    document.querySelectorAll('simple-table td.selection input')[1].click(); // Bruno Petit
    await flush();
    await type('elo');
    expect(context.selected.map(person => person.name)).toEqual(['Bruno Petit']);
    // the selection goes beyond the displayed rows
    const buttons = () =>
      [...document.querySelectorAll('simple-table button.btn-link')].map(b => b.textContent.trim());
    expect(buttons()).toContain('Effacer la sélection');

    document.querySelector('simple-table th.selection input').click();
    await flush();
    [...document.querySelectorAll('simple-table button.btn-link')]
      .find(button => button.textContent.trim() === 'Sélectionner les 3 résultats')
      .click();
    await flush();
    // added to the selection, the row hidden by the search included
    expect(context.selected.map(person => person.name)).toEqual([
      'Bruno Petit',
      'Élodie Martin',
      'Éloïse Durand',
      'Paul Elouan'
    ]);
  });

  test('a { items, totalCount } datasource is not filtered in memory: the parent reloads it', async () => {
    const context = { ds: { items: people.slice(0, 2), totalCount: 5 }, search: undefined, page: 2 };
    component = await stagePeople(
      'datasource.bind="ds" searchable="true" search.bind="search" paginated="true" max-rows="2" page.bind="page"',
      context
    );
    await type('elo');
    expect(context.search).toBe('elo');
    expect(context.page).toBe(1);
    expect(names()).toEqual(['Élodie Martin', 'Bruno Petit']);
  });
});
