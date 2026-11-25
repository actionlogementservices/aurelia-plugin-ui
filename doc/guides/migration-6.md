# Migrating to 6.0.0

The breaking changes first, then the visible changes that need no code change.

## Breaking changes

### Dates are calendar dates `YYYY-MM-DD`

`dateFormat`, `input-datepicker` and `als-datepicker` write a date as a calendar date `YYYY-MM-DD`, without time nor
time zone, instead of the local midnight converted to UTC:

| Date entered | 5.x (in France) | 6.0.0 |
|---|---|---|
| 15/03/2024 | `2024-03-14T23:00:00.000Z` | `2024-03-15` |

In 5.x, the day of the stored value depended on the time zone of the user: the api received the day before, and a date
`2024-03-15` coming from the api was displayed on the 14th in the French West Indies and Guiana. A calendar date is the
same day for every user; the French format is only used to display it.

To migrate:

- **Values sent to the api**: the dates are now `2024-03-15`. An api storing a date (`DateOnly`, `LocalDate`, SQL
  `date`) reads it as is; an api expecting a date time reads it as the midnight of this day.
- **Values read from the api**: `2024-03-15` is displayed on the 15th everywhere. The date times saved with 5.x are
  still accepted, displayed on their day in the local time of the user, as before.
- **Dates built in the application** (`min-date`, `max-date`, `disabled-dates`, initial values): build them with
  `toCalendarDate(date)`, exported by the plugin, instead of `date.toISOString()`:

  ```javascript
  import { toCalendarDate } from '@actionlogementservices/aurelia-plugin-ui';

  minDate = toCalendarDate(new Date()); // today, e.g. '2026-11-25'
  ```

- **Date comparisons**: two calendar dates compare as strings (`endDate >= startDate`); the `day()` helper comparing
  the days of two date times is no longer needed. `parseCalendarDate(value)` gives the local midnight of the day as a
  `Date`.
- **Dates already stored by the api**: a date saved with 5.x is the midnight of the entered day in the time zone of the
  user, converted to UTC. Its day is the one of the value in this time zone, Europe/Paris for most users, e.g.:

  ```sql
  -- SQL Server
  CAST(start_date AT TIME ZONE 'UTC' AT TIME ZONE 'Romance Standard Time' AS date)
  -- PostgreSQL (timestamp without time zone holding UTC)
  (start_date AT TIME ZONE 'UTC' AT TIME ZONE 'Europe/Paris')::date
  ```

### `als-multi-select` and `als-datepicker` are placed in an `als-field`

They no longer accept `label`, `required`, `id`, `name`, `field-only`, `is-error` and `error-message`. Wrap them in an
[`als-field`](./forms.md#als-field) and declare the rules with `ValidationRules`, using `minItems(1)` instead of
`required()` for `als-multi-select`:

```html
<als-field label="Années" required="true">
  <als-multi-select items.bind="years" value.bind="model.years & validate"></als-multi-select>
</als-field>
```

### `numberFormat` displays 0

`numberFormat` displays `0` (`0,00`) instead of nothing. A field that must stay empty until the user fills it is bound
to an `undefined` value: convert the default `0` of the api in the application when loading the data.

### The toast message keeps only the formatting tags

Against XSS, the message of the `ToastService` keeps only the formatting tags `b`, `strong`, `i`, `em`, `br`, `p`, `ul`,
`ol` and `li`, without attributes. Links, images and the other elements are replaced by their text.

## Visible changes

- **Focus ring**: every link, the tabs (`.nav-link`), the pagination (`.page-link`) and the close buttons (`.btn-close`)
  get the focus ring of the theme on keyboard focus, instead of the browser default or the Bootstrap glow.
- **Toasts**: a delay of `0` keeps the toast until the user closes it (it used to fail); the close button is labelled
  "Fermer"; the screen readers announce `info` and `success` politely (`role="status"`), `error` and `warning` at once.
- **`environment-ribbon`**: without `environment`, the ribbon displays nothing instead of failing.
- **`numberFormat`**: a non numeric value displays nothing instead of `NaN`.

The deprecated `als-input-number`, `als-input-text`, `als-input-password` and `als-select` are still available in
6.0.0; see [Deprecated components](./forms.md#deprecated-components) to replace them.
