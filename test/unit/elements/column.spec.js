import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { Column } from '../../../src/elements/simple-table/column';

const flush = (delay = 30) => new Promise(resolve => setTimeout(resolve, delay));
const text = selector => document.querySelector(selector).textContent.trim();

/**
 * Stages a simple-table with the specified column.
 * @param {string} column column html
 * @returns {Promise<any>} the staged component
 */
async function stage(column) {
  const component = StageComponent.withResources([
    PLATFORM.moduleName('elements/simple-table/simple-table'),
    PLATFORM.moduleName('elements/simple-table/column')
  ])
    .inView(
      `<simple-table datasource.bind="ds" metadata.bind="{ year: 2026 }" no-row-count-header="true">${column}</simple-table>`
    )
    .boundTo({ ds: [{ id: 7, name: 'seven' }] });
  await component.create(bootstrap);
  await flush();
  return component;
}

describe('column', () => {
  let component;
  afterEach(() => component?.dispose());

  test.each([
    ['asc', 'text', 'sort-alpha-up'],
    ['desc', 'text', 'sort-alpha-down-alt'],
    ['asc', 'numeric', 'sort-numeric-up'],
    ['desc', 'numeric', 'sort-numeric-down-alt'],
    [undefined, 'text', 'sort-up-alt']
  ])('sortIcon for %s %s order is %s', (sortOrder, sortType, icon) => {
    const column = Object.assign(new Column({ elementInstruction: {} }), { sortOrder, sortType });
    expect(column.sortIcon.split(' ')[0]).toBe(icon);
  });

  test('without content, displays the header and the cell-key property', async () => {
    component = await stage('<column header="Name" cell-key="name"></column>');
    expect(text('thead th')).toBe('Name');
    expect(text('tbody td')).toBe('seven');
  });

  test('content is the cell template, bound to the item', async () => {
    component = await stage('<column header="Id"><b>#${item.id}</b></column>');
    expect(document.querySelector('tbody td b').textContent).toBe('#7');
  });

  test('a replace-part="header" template replaces the header text, the rest being the cell template', async () => {
    component = await stage(
      '<column header="ignored" cell-key="name"><template replace-part="header"><i>${metadata.year}</i></template>${item.id}</column>'
    );
    expect(document.querySelector('thead th i').textContent).toBe('2026');
    expect(text('thead th')).not.toContain('ignored');
    expect(text('tbody td')).toBe('7');
  });

  test('a sortable column header is a button showing the sort icon', async () => {
    component = await stage(
      '<column header="Id" cell-key="id" sortable="true" sort-type="numeric"></column>'
    );
    const button = document.querySelector('thead th button');
    button.click();
    await flush();
    expect(button.querySelector('i').className).toContain('sort-numeric-up');
  });
});
