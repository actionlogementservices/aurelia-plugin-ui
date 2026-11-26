# Migrating to 6.0.0

This guide lists every change of 6.0.0 that may require a change in an application using the plugin. Each breaking
change gives how to **find** the code concerned, what to **change** (before / after), and what to **check**.

## Steps

1. Update the dependency: `"@actionlogementservices/aurelia-plugin-ui": "^6.0.0"`. The peer dependencies are unchanged.
2. Find the code concerned by each breaking change with the searches below (ripgrep, from the root of the
   application), and apply the change described in its section for every match.
3. Check the visible changes against the custom styles of the application.
4. Run the tests of the application and check the forms in the browser.

```sh
# calendar dates: the date fields, the dateFormat converter, and the dates built or compared in the code
rg -n "als-datepicker|input-datepicker|dateFormat" --glob "*.html"
rg -n "toISOString\(\)|setHours\(0, ?0, ?0, ?0\)" --glob "*.{js,ts}"
# als-field around als-multi-select and als-datepicker
rg -n "<als-multi-select|<als-datepicker" --glob "*.html"
# numberFormat displays 0 (the pattern does not match formInputNumberFormat)
rg -n "\|\s*numberFormat\b" --glob "*.html"
# rounding of formInputNumberFormat
rg -n "formInputNumberFormat" --glob "*.html"
# toast message: the files using the ToastService, then the calls .info( .success( .warning( .error( of its instance
rg -l "ToastService" --glob "*.{js,ts}"
# combobox selects and auto-completes: the styles, the end-to-end tests and the code reaching their inner DOM or methods
rg -n "(simple-select|filterable-select|badges-select|auto-complete)[^{,]*(button|bi-x-lg|\[role)" --glob "*.{css,scss,less}"
rg -n "listitem|searchText-|dropDown-|\.dropdown-item|bi-x-lg" --glob "*.{js,ts,cy.*,spec.*,e2e.*}"
rg -n "manageKey|ignoringReset" --glob "*.{js,ts,html}"
```

## Breaking changes

### Dates are calendar dates `YYYY-MM-DD`

`dateFormat`, `input-datepicker` and `als-datepicker` write a date as a calendar date `YYYY-MM-DD`, without time nor
time zone, instead of the local midnight converted to UTC. They read a calendar date as the local midnight of its day.

| Date entered | 5.x (in France) | 6.0.0 |
|---|---|---|
| 15/03/2024 | `2024-03-14T23:00:00.000Z` | `2024-03-15` |

In 5.x, the day of the value depended on the time zone of the user: the api received the day before, and a date
`2024-03-15` coming from the api was displayed on the 14th in the French West Indies and Guiana. A calendar date is the
same day for every user; the French format is only used to display it.

The plugin exports two helpers:

- `toCalendarDate(date: Date): string`: the day of a `Date` in the local time, e.g. `'2026-11-25'`.
- `parseCalendarDate(value: string | Date): Date | undefined`: the local midnight of a calendar date; an ISO date time
  or a `Date` is also accepted, its day being the one of the local time.

**Change:**

- **Dates built in the application** (`min-date`, `max-date`, `disabled-dates`, initial or default values): build them
  with `toCalendarDate` instead of `toISOString()`.

  ```javascript
  // before
  this.minDate = new Date().toISOString();
  // after
  import { toCalendarDate } from '@actionlogementservices/aurelia-plugin-ui';
  this.minDate = toCalendarDate(new Date());
  ```

- **Dates loaded from the api**: the date times saved with 5.x are still displayed, on their day in the local time, as
  before. A field keeps its loaded value until the user picks a date, which is then a calendar date: normalize the
  value when loading the data, so that the model and the api always hold the same format.

  ```javascript
  import { parseCalendarDate, toCalendarDate } from '@actionlogementservices/aurelia-plugin-ui';

  const startDate = parseCalendarDate(dto.startDate); // undefined for an empty or invalid value
  this.model.startDate = startDate ? toCalendarDate(startDate) : undefined;
  ```

- **Date comparisons**: compare two calendar dates as strings. Remove the helpers comparing the days of two date times.

  ```javascript
  // before
  const day = isoDate => new Date(isoDate).setHours(0, 0, 0, 0);
  ValidationRules.ensure('endDate').satisfies((endDate, model) => day(endDate) >= day(model.startDate));
  // after
  ValidationRules.ensure('endDate').satisfies((endDate, model) => endDate >= model.startDate);
  ```

**Check the api** (the dates it receives are now `2024-03-15`):

- An api storing a date (.NET `DateOnly`, Java `LocalDate`, SQL `date`) reads it as is.
- An api expecting a date time may reject a date without time: Java `Instant` and `OffsetDateTime` do, .NET `DateTime`
  reads it as the midnight of the day. Change the api to accept a date, or convert the value in the application before
  sending it.

**Dates already stored by the api** (to change in the api or its database, not in the application): a date saved with
5.x is the midnight of the entered day in the time zone of the user, converted to UTC; it must be converted only if the
api or the database filters or compares the dates by day. Its day is the one of the value in the time zone of the user,
Europe/Paris for most users:

```sql
-- SQL Server, datetime2 column holding UTC (for a datetimeoffset column, remove "AT TIME ZONE 'UTC'")
CAST(start_date AT TIME ZONE 'UTC' AT TIME ZONE 'Romance Standard Time' AS date)
-- PostgreSQL, timestamp column holding UTC (for a timestamptz column, remove "AT TIME ZONE 'UTC'")
(start_date AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Paris')::date
```

### `als-multi-select` and `als-datepicker` are placed in an `als-field`

They are plain controls placed in an [`als-field`](./forms.md#als-field), which displays the label, the required
marker, the hint and the validation error, and validated with aurelia-validation (`& validate`). Their attributes
`label`, `required`, `id`, `name`, `type`, `field-only`, `is-error`, `error-message`, `pristine`, `on-focus`,
`on-change` and `on-blur` are removed. The validation requires the aurelia-validation plugin and a
`ValidationController`: see [Validation setup](./forms.md#validation-setup).

| Removed attribute | Replacement |
|---|---|
| `label`, `required` | `label` and `required` of the `als-field` |
| `id`, `name`, `type`, `pristine` | None: `als-field` generates the id |
| `field-only` | An `als-field` without `label`: it still displays the validation error |
| `is-error`, `error-message` | A rule of `ValidationRules` and `& validate` on `value.bind` |
| `on-focus`, `on-blur` | `focusin.trigger` and `blur.trigger` on the element |
| `on-change` | Observe the bound property (`BindingEngine.propertyObserver`) |

```html
<!-- before -->
<als-multi-select label="Années" required="true" items.bind="years" value.bind="model.years"
  is-error.bind="yearsError" error-message="Choisissez une année."></als-multi-select>
<als-datepicker label="Date de début" required="true" value.bind="model.startDate"></als-datepicker>

<!-- after -->
<als-field label="Années" required="true">
  <als-multi-select items.bind="years" value.bind="model.years & validate"></als-multi-select>
</als-field>
<als-field label="Date de début" required="true">
  <als-datepicker value.bind="model.startDate & validate"></als-datepicker>
</als-field>
```

```javascript
// required() accepts an empty array: use minItems(1) for als-multi-select
ValidationRules.ensure('years').minItems(1).withMessage('Choisissez une année.')
  .ensure('startDate').required()
  .on(this.model);
```

### `numberFormat` displays 0

`numberFormat` displays `0` (`0,00`) instead of nothing. A non numeric value displays nothing instead of `NaN`.

**Change**: a field that must stay empty until the user fills it is bound to `undefined`: convert the default `0` of
the api when loading the data.

```javascript
this.model.amount = dto.amount || undefined;
```

### `formInputNumberFormat` rounds to the nearest

A value with more decimals than its type displays (2 for `decimal`, none for `integer` and `currency`) is rounded to
the nearest, like the `input-mask` does, instead of down: `1500.99` in a `currency` field is displayed `1 501 €`
instead of `1 500 €`. The rounding only changes the display: the model keeps `1500.99` until the user edits the field.

**Change**: a field rounded down (e.g. to the lower euro) rounds its model when loading the data.

```javascript
this.model.amount = Math.floor(dto.amount);
```

### The toast message keeps only the formatting tags

Against XSS, the message of the `ToastService` keeps only the formatting tags `b`, `strong`, `i`, `em`, `br`, `p`, `ul`,
`ol` and `li`, without attributes. The other elements (links, images, `span` with a class...) are replaced by their
text, and the comments are removed.

**Change**: a message with a link or a styled element loses them. Display the link in the page or in a dialog
(`DialogService`) instead of the toast. A message that is text or formatting only needs no change.

### The selects and auto-completes are WAI-ARIA comboboxes

`simple-select`, `filterable-select`, `badges-select`, `auto-complete` and `badges-auto-complete` follow the
[WAI-ARIA combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) (see
[Keyboard and accessibility](./selects.md#keyboard-and-accessibility)): the focus stays on the input while the arrows
move the active option. Their attributes, events (`change`, `blur`) and item templates are unchanged, but their inner
DOM and keyboard behavior change:

| | 5.x | 6.0.0 |
|---|---|---|
| Input | `role="button"` (or `searchbox`) | `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant` |
| List | `div.dropdown-menu` | `div.dropdown-menu[role="listbox"]` |
| Options | `button.dropdown-item[role="listitem"]` | `div.dropdown-item[role="option"]`, `aria-selected` |
| Host element | `role="list"`, `aria-haspopup="listbox"` | no role |
| Badge removal | `i.bi-x-lg[role="button"]` | `button[aria-label="Retirer <label>"]` containing `i.bi-x-lg` |
| `↓` / `↑` / `Tab` | move the focus to the first option | move the active option / leave the field |
| Any key on an option | picks it | the focus never leaves the input |
| After picking | the input loses the focus | the input keeps the focus |
| `manageKey(keyCode: string)` | | `manageKey(event: KeyboardEvent)`; `ignoringReset` is removed |

**Change:**

- **Styles** of the application targeting the options as buttons or the badge icon: target the classes instead.

  ```css
  /* before */
  simple-select button.dropdown-item { ... }
  badges-select .badge i.bi-x-lg { ... }
  /* after */
  simple-select .dropdown-item { ... }
  badges-select .badge button { ... }
  ```

- **End-to-end tests** opening the list with a click on a `button` role, or picking a `listitem`: use the combobox and
  option roles (Testing Library, Playwright), or the keyboard.

  ```javascript
  // before
  await page.getByRole('button', { name: 'Ville' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Paris' }).click();
  // after
  await page.getByRole('combobox', { name: 'Ville' }).click();
  await page.getByRole('option', { name: /Paris/ }).click();
  // or with the keyboard
  await page.getByRole('combobox', { name: 'Ville' }).press('ArrowDown');
  await page.keyboard.press('Enter');
  ```

  A badge is removed with `getByRole('button', { name: 'Retirer Paris' })`.

- **Code calling `manageKey`** or setting `ignoringReset` through the view-model: remove it, the keyboard is handled by
  the element.
- **Code relying on the native `blur` of the inner input after a pick** (e.g. to move to the next field): listen to the
  `blur` event of the element, still dispatched after each pick, or let the user move on with `Tab`.

**Check**: in the browser, open each of these fields with `↓`, move with the arrows, pick with `Enter`, and leave with
`Tab`; with `badges-*`, reach a badge with `Shift+Tab` and remove it with `Enter`.

## Visible changes

They need no code change, unless the application styles the same elements.

- **Focus ring**: every link, the tabs (`.nav-link`), the pagination (`.page-link`) and the close buttons (`.btn-close`)
  get the focus ring of the theme on keyboard focus, instead of the browser default or the Bootstrap glow. Check the
  `:focus` and `:focus-visible` rules of the application on these elements (search `focus`, `*.css` and `*.scss`).
- **Selects and auto-completes**: the field gets the focus ring of the theme instead of the Bootstrap glow; while the
  arrows move in the list, the ring moves to the active option. The cross of a badge is a 24px button with a white ring.
- **Info color**: `$info` is the info blue of the DSFR, `#0063cb`, instead of `#0080ff`, whose text did not reach the
  contrast required by the WCAG: the info toast has a white text. It also colors `btn-info`, `alert-info`, `table-info`
  (the row count of `simple-table`), the badges and the `loading-indicator` bar. `$cyan` is back to the Bootstrap cyan
  `#0dcaf0`: check the uses of `$cyan` and `--bs-cyan` in the application.
- **Toasts**: a delay of `0` keeps the toast until the user closes it (it used to fail); the close button is labelled
  "Fermer"; the screen readers announce `info` and `success` politely (`role="status"`), `error` and `warning` at once.
- **`als-field`**: with `required="true"`, the label ends with a visually hidden "(obligatoire)", so that the screen
  readers announce the required fields: the accessible name of the control becomes e.g. "Nom (obligatoire)". Check the
  end-to-end tests finding the field by its exact name (`getByLabel('Nom', { exact: true })`).
- **`environment-ribbon`**: without `environment`, the ribbon displays nothing instead of failing.

The deprecated `als-input-number`, `als-input-text`, `als-input-password` and `als-select` are still available in
6.0.0; see [Deprecated components](./forms.md#deprecated-components) to replace them.
