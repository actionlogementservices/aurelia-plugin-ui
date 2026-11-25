# Other components

| Component | Role | API |
|---|---|---|
| **Dates** | | |
| [`input-datepicker`](#input-datepicker) | Date input with a calendar dropdown | [InputDatepicker](../src-elements-input-datepicker_input-datepicker.md) |
| [`dateFormat`](#dateformat-value-converter) | Value converter formatting a date | [DateFormatValueConverter](../src-value-converters_date-format.md) |
| **Numbers** | | |
| [`input-mask`](#input-mask-custom-attribute) | Custom attribute masking a number input | [InputMaskCustomAttribute](../src-attributes_input-mask.md) |
| [`numberFormat`, `cleanInputMask`](#numberformat-and-cleaninputmask-value-converters) | Value converters formatting and parsing masked numbers | [NumberFormat](../src-value-converters_number-format.md), [CleanInputMask](../src-value-converters_clean-input-mask.md) |
| **Table** | | |
| [`simple-table`](#simple-table) | Table with column templates, sorting, selection and pagination | [SimpleTable](../src-elements-simple-table_simple-table.md), [Column](../src-elements-simple-table_column.md) |
| **Page layout** | | |
| [`als-pre-login`](#als-pre-login) | Landing page before authentication | [AlsPreLogin](../src-layouts-als-pre-login_als-pre-login.md) |
| [`als-footer`](#als-footer) | Action Logement footer | [AlsFooter](../src-elements-als-footer_als-footer.md) |
| [`als-user-menu`](#als-user-menu) | User initials and account actions menu | [AlsUserMenu](../src-elements-als-user-menu_als-user-menu.md) |
| [`breadcrumbs`](#breadcrumbs) | Breadcrumbs of the current route | [Breadcrumbs](../src-elements-breadcrumbs_breadcrumbs.md) |
| [`environment-ribbon`](#environment-ribbon) | Ribbon displaying the current environment | [EnvironmentRibbon](../src-elements-environment-ribbon_environment-ribbon.md) |
| [`loading-indicator`](#loading-indicator) | Progress bar displayed while loading | [LoadingIndicator](../src-elements-loading-indicator_loading-indicator.md) |
| **Utilities** | | |
| [`als-dropdown`](#als-dropdown) | Generic Bootstrap dropdown | [AlsDropdown](../src-elements-als-dropdown_als-dropdown.md) |
| [`no-submit`](#no-submit-custom-attribute) | Custom attribute preventing a form submission | [NoSubmitCustomAttribute](../src-attributes_no-submit.md) |
| [`als-gtag`](#als-gtag) | Google Tag Manager script | [AlsGtag](../src-elements-als-gtag_als-gtag.md) |

The `<lock>` element is described with the [`LockService`](./services.md#lockservice). In a form, prefer the
[`als-datepicker`](./forms.md#als-datepicker) field and the [`formInputNumberFormat`](./forms.md#numbers-forminputnumberformat-value-converter)
converter.

## Dates

### `input-datepicker`

Calendar dropdown based on [vanilla-js datepicker](https://mymth.github.io/vanillajs-datepicker/#/), selecting a single
date bound to `date`.

![input-datepicker rendering](../screenshot/input-datepicker.png)

```html
<input-datepicker date.bind="date"></input-datepicker>
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `date` | Selected date | ISO string | |
| `placeholder` | Placeholder displayed when no date is selected | Any string | |
| `disabled` | Disable the user interaction | `true` or `false` | `false` |
| `readonly` | Readonly field | `true` or `false` | `false` |
| `autohide` | Hides the calendar after a selection | `true` or `false` | `true` |
| `disabled-days` | Days of week to disable | Array of numbers, 0 for Sunday, 1 for Monday, and so on | `[]` |
| `disabled-dates` | Specific dates to disable | Array of ISO strings | `[]` |
| `min-date` | All the dates before this date are disabled | ISO string | |
| `max-date` | All the dates after this date are disabled | ISO string | |

### `dateFormat` value converter

Displays a date (ISO string or `Date`) in the French format `DD/MM/YYYY`, or in `YYYY-MM-DD` or `MM/DD/YYYY`. From
the view, it parses a date typed in this format into an ISO string.

```html
<span>${contract.startDate | dateFormat}</span>
<span>${contract.startDate | dateFormat:'YYYY-MM-DD'}</span>
```

## Numbers

### `input-mask` custom attribute

Masks a number input with the [inputmask](https://www.npmjs.com/package/inputmask) package: French digit grouping
(`1 234,5`), no negative numbers.

| Value | Decimals |
|---|---|
| `integer` | 0 |
| `decimal` | 2 |
| `currency` | 0 |
| `percentage` | 1, between 0 and 100 |

### `numberFormat` and `cleanInputMask` value converters

`numberFormat` formats a number for the view, and `cleanInputMask` parses the masked text back to a number. Bind them
separately, one way each:

```html
<input
  type="text"
  input-mask="currency"
  value.one-time="amount | numberFormat"
  value.from-view="amount | cleanInputMask" />
```

`numberFormat` accepts the options `{ locale, digits, suffix }`, by default `{ locale: 'fr-FR', digits: 2, suffix: '' }`:
`${amount | numberFormat:{ digits: 0, suffix: ' €' }}`.

In a form validated with aurelia-validation, use [`formInputNumberFormat`](./forms.md#numbers-forminputnumberformat-value-converter)
instead: it formats and parses in a single two-way binding.

## `simple-table`

Scrollable table with **column templates**, **in-memory sorting**, row **selection** and optional **pagination**, well
adapted for a small number of items (typically **less than 100**) or a paginated datasource.

![simple-table rendering](../screenshot/simple-table-2.png)

Bind the items to `datasource`, and declare the columns with `<column>` elements: `cell-key` names the displayed
property, and the content of the element, where `item` is the current row, replaces the default cell content.

```html
<simple-table
  parent-ref.bind="$this"
  datasource.bind="itemsList"
  selected-items.bind="selectedItems"
  selection-mode="multiple"
  value-key="id">
  <column header="Id" cell-key="id" sortable="true" sort-type="numeric" width="80px">
    <span class="badge text-bg-secondary">${item.id}</span>
  </column>
  <column header="Nom" cell-key="name" sortable="true"></column>
  <column cell-key="headcount" sortable="true" sort-type="numeric">
    <template replace-part="header">Effectif ${metadata.currentYear}</template>
    ${item.headcount}
  </column>
  <column>
    <button class="btn btn-secondary" click.trigger="parentRef.showItemDetails(item)">Détails</button>
  </column>
</simple-table>
```

In a column template, `parentRef` is the viewmodel bound to `parent-ref`, and `metadata` the value bound to `metadata`.

### Pagination

Set `paginated="true"`: a page size selector (`10`, `20`, `50` or `100`) is displayed next to the pagination.

- With an array `datasource`, pagination and sorting are done in memory on the whole array.
- With a `{ items, totalCount }` `datasource` (`pageResult` below), the parent loads the requested page itself: bind
  `page` and `max-rows` to viewmodel properties and reload on their change. Sorting then only applies to the displayed
  page.

```html
<simple-table datasource.bind="pageResult" paginated="true" page.bind="page" max-rows.bind="pageSize">
  ...
</simple-table>
```

### Tooltips

- When a cell is too small to render its content (an ellipsis is shown), a Bootstrap tooltip is created on it.
- A Bootstrap tooltip is also created on the elements of a column template with `data-bs-*` attributes. Always give a
  non empty title, to avoid a Bootstrap error:

  ```html
  <column header="Id" cell-key="id">
    <span data-bs-toggle="tooltip" data-bs-title="${item && item.name ? item.name : ' '}">${item.id}</span>
  </column>
  ```

### Attributes

| `simple-table` attribute | Role | Possible values | Default value |
|---|---|---|---|
| `datasource` | Items to display | Array of objects, or `{ items, totalCount }` when paginated by the parent | |
| `value-key` | Property of the item used to differentiate them | Any string representing a property present on the item | `name` |
| `selection-mode` | Selection mode | `none`, `single` or `multiple` | `none` |
| `selected-items` | Selected items | Array of objects | `[]` |
| `disabled` | Disables the user interaction: selection, sorting and page size | `true` or `false` | `false` |
| `disableable-rows` | Allows disabling rows individually | `true` or `false` | `false` |
| `disable-prop-name` | Property of the item telling that its row is disabled | Any string | `disabled` |
| `max-rows` | Maximal number of displayed rows, the page size when paginated (two-way binding) | Any number > 0 | `50`, `10` when paginated |
| `paginated` | Enables the pagination | `true` or `false` | `false` |
| `page` | Current page, 1-based (two-way binding) | Any number > 0 | `1` |
| `page-size-text` | Text displayed next to the page size selector | Any string | `éléments par page` |
| `max-height` | CSS max height of the table | Any CSS height | `500px` |
| `fixed-row-height` | Fixed row height. When `false`, the text wraps and the rows may have different heights | `true` or `false` | `true` |
| `no-row-count-header` | Hides the row count header | `true` or `false` | `false` |
| `no-result-text` | Text displayed when there is no item | Any string | `Aucun résultat` |
| `result-text` | Text displayed after the number of items | Any string | `résultat(s).` |
| `warning-template-text` | Warning displayed when not all the items are displayed. Must contain the `{maxRows}` token | Any string with `{maxRows}` | `Seuls les {maxRows} premiers résultats sont affichés.` |
| `metadata` | Extra data available in the column templates | Any | |
| `parent-ref` | Viewmodel available in the column templates as `parentRef` | Any object | |

| `column` attribute | Role | Possible values | Default value |
|---|---|---|---|
| `header` | Header of the column. Use `<template replace-part="header">` for an HTML header | Any string | |
| `cell-key` | Property of the item displayed in the cell, and used for sorting | Any string representing a property present on the item | |
| `sortable` | Is the column sortable | `true` or `false` | `false` |
| `sort-order` | Sorting order of the column | `asc` or `desc` | |
| `sort-type` | Sorting type | `text` or `numeric` | `text` |
| `width` | CSS width of the column | Any CSS width | `auto` |

## Page layout

### `als-pre-login`

Landing page displayed before authentication, with a login button, a help link and an [`als-footer`](#als-footer).

![screenshot of the als-pre-login layout component](../screenshot/als-pre-login.png)

```html
<als-pre-login
  help-url="https://aide.example.com"
  footer-links.bind="footerLinks"
  on-connect-button-click.call="goToLogin()"></als-pre-login>
```

```javascript
export class LoginPage {
  footerLinks = [
    { text: 'Mentions légales', url: 'https://example.com/mentions-legales' },
    { text: 'CGU', url: 'https://example.com/cgu' }
  ];

  goToLogin() {
    // navigates to the login page or opens the authentication flow
  }
}
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `title` | Main title of the pre-login panel | Any string | `Mon Espace de Déclaration` |
| `subtitle` | Subtitle displayed below the title | Any string | `Accès réservé aux entreprises` |
| `img-path` | Image displayed in the panel, none when empty | Any image URL | `''` |
| `help-url` | URL of the help link displayed under the login button | Any URL | `#` |
| `footer-links` | Links of the footer | Array of `{ text, url }` | |
| `footer-type` | Footer variant | `compact` or `default` | `compact` |
| `on-connect-button-click` | Called when the login button is clicked | Function (`.call` binding) | |

### `als-footer`

Action Logement footer, with the logo, a list of links, the accessibility conformity link and the social media links.

```html
<als-footer links.bind="footerLinks"></als-footer>
```

The attributes are read once (`one-time` binding):

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `links` | Links of the footer | Array of `{ text, url }` | `[]` |
| `type` | Footer variant | `default` or `compact` | `default` |
| `logo-url` | URL of the logo link | Any URL | `https://www.actionlogement.fr/entreprise` |
| `accessibility-text` | Text of the accessibility conformity link | Any string | `Accessibilité : non conforme` |
| `accessibility-url` | URL of the accessibility conformity link | Any URL | `https://www.actionlogement.fr/schema-pluriannuel-accessibilite-numerique` |
| `hide-social-media-links` | Hides the social media links | `true` or `false` | `false` |
| `youtube-url`, `twitter-url`, `linkedin-url` | URLs of the social media pages | Any URL | Action Logement pages |

### `als-user-menu`

User initials in an avatar, opening a menu of account actions. Each item is a link when `href` is set, otherwise its
`click` function is called.

```html
<als-user-menu initials="UA" items.bind="userMenuItems"></als-user-menu>
```

```javascript
userMenuItems = [
  { label: 'Mes informations', icon: 'bi-person', href: '#/profil' },
  { label: 'Déconnexion', icon: 'bi-x-circle', click: () => this.auth.logout() }
];
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `initials` | Initials displayed in the avatar | Any string | `''` |
| `label` | Label displayed below the avatar | Any string | `Mon compte` |
| `items` | Menu items, `icon` being a bootstrap-icons class | Array of `{ label, icon?, href?, click? }` | `[]` |

### `breadcrumbs`

Breadcrumbs of the current route of the root Aurelia router: an `Accueil` link to the root, then a step per route
having a `title`, except the default route (`''`). The last step is the current page (`aria-current="page"`), the
other ones are links to their route, which must have a `name`. It has no attribute.

```html
<breadcrumbs></breadcrumbs>
```

### `environment-ribbon`

Ribbon displaying the name of the current environment in a corner of the page, colored by the environment type. Hide
it in production:

```html
<environment-ribbon
  if.bind="environment.type !== 'prod'"
  environment.one-time="environment"
  position="top-left"></environment-ribbon>
```

```javascript
environment = { name: 'RECETTE', type: 'recette' };
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `environment` | Environment to display; without it, nothing is displayed | `{ name, type }`, `type` being `dev`, `recette`, `preprod` or `prod` | |
| `position` | Corner of the ribbon | `top-left`, `top-right`, `bottom-left` or `bottom-right` | `top-left` |

### `loading-indicator`

Striped progress bar displayed while `loading` is `true`, e.g. during api calls.

```html
<loading-indicator loading.bind="api.isRequesting"></loading-indicator>
```

## Utilities

### `als-dropdown`

Generic Bootstrap dropdown, used by `als-user-menu` and `als-multi-select`. Its content is projected into the menu
(a `<ul class="dropdown-menu">`), and the content of a `slot="toggle"` element into the toggle button.

```html
<als-dropdown label="Actions" menu-class="dropdown-menu-end">
  <li><a class="dropdown-item" href="#/export">Exporter</a></li>
  <li><button type="button" class="dropdown-item" click.trigger="print()">Imprimer</button></li>
</als-dropdown>
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `label` | Text of the toggle button, when no `toggle` slot is provided | Any string | `''` |
| `disabled` | Disables the toggle button | `true` or `false` | `false` |
| `autosize` | Sizes the dropdown to the width of its parent | `true` or `false` | `false` |
| `auto-close` | Bootstrap `autoClose` option | `true`, `false`, `inside` or `outside` | `true` |
| `toggle-class` | CSS classes of the toggle button | Any string | `''` |
| `menu-class` | CSS classes of the menu | Any string | `''` |
| `aria-label` | Accessible name of the toggle button, overriding its content | Any string | |
| `aria-describedby`, `aria-invalid` | Applied to the toggle button, e.g. to link an error message | Ids / `true` or `false` | |
| `menu-aria-label` | Accessible name of the menu, e.g. to group checkboxes | Any string | |
| `on-focus`, `on-blur` | Called when the toggle button gets or loses the focus | Function receiving the `FocusEvent` | |

### `no-submit` custom attribute

Prevents a `<form>` from being submitted, e.g. by the Enter key in one of its inputs. Handle the actions with
`click.trigger` on the buttons instead.

```html
<form no-submit>
  ...
  <button type="button" class="btn btn-primary" click.trigger="save()">Enregistrer</button>
</form>
```

### `als-gtag`

Injects the Google Tag Manager script and its `noscript` iframe fallback. Use it once, near the root of the application
(e.g. in `app.html`): each instance adds another script and iframe.

```html
<als-gtag tag-id="GTM-ABC1234"></als-gtag>
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `tag-id` | Google Tag Manager container identifier | Any string | `GTM-XXXXXX` |
