# Forms

Form fields are **native controls** (`input`, `select`, `textarea`) or form custom elements (`als-multi-select`,
`als-datepicker`, [`auto-complete`](./auto-complete.md#in-a-form)) placed in an [`<als-field>`](#als-field), which adds
the label, the hint and the validation error.

| Component | Role | API |
|---|---|---|
| [`als-field`](#als-field) | Label, required marker, hint and validation error around a control | [AlsField](../src-elements-forms-als-field_als-field.md) |
| [`als-datepicker`](#als-datepicker) | Date input with a calendar | [AlsDatepicker](../src-elements-forms-als-datepicker_als-datepicker.md) |
| [`als-multi-select`](#als-multi-select) | Dropdown of checkboxes selecting several values | [AlsMultiSelect](../src-elements-forms-als-multi-select_als-multi-select.md) |
| [`als-password-toggle`](#passwords-als-password-toggle) | Button masking or revealing a password input | [AlsPasswordToggle](../src-elements-forms-als-password-toggle_als-password-toggle.md) |
| [`input-filter`](#filtering-characters-input-filter-custom-attribute) | Custom attribute removing forbidden characters | [InputFilter](../src-attributes_input-filter.md) |
| [`formInputNumberFormat`](#numbers-forminputnumberformat-value-converter) | Value converter for masked number inputs | [FormInputNumberFormat](../src-value-converters_form-input-number-format.md) |

## Validation setup

Validation relies on [aurelia-validation](https://aurelia.io/docs/plugins/validation): register the plugin in your
`main.js` and bind the values with `& validate`.

```javascript
aurelia.use
  .plugin(PLATFORM.moduleName('aurelia-validation'))
  .plugin(PLATFORM.moduleName('@actionlogementservices/aurelia-plugin-ui'));
```

```javascript
import { inject, NewInstance } from 'aurelia-framework';
import { ValidationController, ValidationRules } from 'aurelia-validation';

@inject(NewInstance.of(ValidationController))
export class MyForm {
  model = { name: '', age: undefined };

  constructor(controller) {
    this.controller = controller;
    ValidationRules.ensure('name').required().ensure('age').required().range(18, 150).on(this.model);
  }

  async submit() {
    const { valid } = await this.controller.validate();
  }
}
```

The plugin translates the aurelia-validation messages in French (`Ce champ est obligatoire.`...). As the label is
displayed above the control, the messages do not repeat the property name.

## `als-field`

Lays out a form control with the label, the required marker, a hint and the first validation error. The control is
projected as is: every native attribute and Aurelia binding keeps working. When a `ValidationController` is available,
the field displays the errors of the controls it contains, and sets `is-invalid`, `aria-invalid` and
`aria-describedby` on them. The label is linked to the control by its `id`, generated when missing.

```html
<als-field label="Nom" required="true">
  <input class="form-control" value.bind="model.name & validate" />
</als-field>
<als-field label="Âge" hint="Valeur comprise entre 18 et 150.">
  <input class="form-control" input-mask="integer" value.bind="model.age | formInputNumberFormat:'integer' & validate" />
</als-field>
<als-field label="Année">
  <select class="form-select" value.bind="model.year & validate">
    <option model.bind="null">Sélectionner</option>
    <option repeat.for="year of years" model.bind="year">${year}</option>
  </select>
</als-field>
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `label` | Label displayed above the control | Any string | `''` |
| `required` | Displays the required marker, the rule itself is declared with `ValidationRules` | `true` or `false` | `false` |
| `hint` | Help text displayed below the control | Any string | `''` |
| `group` | Lays out a group of controls answering a single question (radio buttons, checkboxes, composite inputs) | `true` or `false` | `false` |

### Groups of controls

With `group="true"`, a `<label for>` would only name the first control: the label names the whole group instead
(`role="group"` and `aria-labelledby` on the field), and the hint and the error message describe the group
(`aria-describedby` on the field). The invalid controls still get `is-invalid` and `aria-invalid`.

```html
<als-field label="Civilité" required="true" group="true">
  <div repeat.for="item of civilities" class="form-check form-check-inline">
    <input type="radio" class="form-check-input" id="civility-${item.value}" name="civility"
      model.bind="item.value" checked.bind="model.civility & validate" />
    <label class="form-check-label" for="civility-${item.value}">${item.label}</label>
  </div>
</als-field>
```

A single checkbox does not need `group`, its own label names it:

```html
<als-field>
  <div class="form-check">
    <input type="checkbox" class="form-check-input" id="terms" checked.bind="model.terms & validate" />
    <label class="form-check-label" for="terms">J'accepte les conditions d'utilisation</label>
  </div>
</als-field>
```

### Server errors

An error returned by the server is displayed like a local one: add it to the controller for the property bound in the
field. It is removed the next time the property is validated, e.g. when the user changes the value and leaves the
field.

```javascript
async submit() {
  const { valid } = await this.controller.validate();
  if (!valid) return;
  const response = await this.api.save(this.model);
  if (response.emailAlreadyUsed) {
    this.controller.addError('Cet email est déjà utilisé.', this.model, 'email');
  }
}
```

## Native inputs

### Numbers: `formInputNumberFormat` value converter

Formats a number for an [`input-mask`](./components.md#input-mask-custom-attribute) input and parses the masked text
back to a number. Use the same type for both: `integer` (default), `decimal` or `currency` (euros).

A value with more decimals than the type displays (2 for `decimal`, none for `integer` and `currency`) is rounded to
the nearest, by the mask as by the converter, without changing the model. A business rounding, e.g. to the lower euro,
is applied to the model by the application, when loading the data (`amount = Math.floor(dto.amount)`).

```html
<input class="form-control" input-mask="currency" value.bind="model.amount | formInputNumberFormat:'currency' & validate" />
```

### Filtering characters: `input-filter` custom attribute

Removes the forbidden characters as soon as they are typed, pasted or autofilled. The value is either the predefined
`email` filter or a regular expression matching the forbidden characters.

```html
<input type="email" class="form-control" input-filter="email" value.bind="model.email & validate" />
<input class="form-control" input-filter="[^0-9]" value.bind="model.code & validate" />
```

### Passwords: `als-password-toggle`

Button masking or revealing the password input of the same `als-field`, placed after the input.

```html
<als-field label="Mot de passe" required="true">
  <input type="password" class="form-control" autocomplete="current-password" value.bind="model.password & validate" />
  <als-password-toggle></als-password-toggle>
</als-field>
```

### Files

A native file input works in an `als-field`. Bind it with `files.bind` (a `FileList`), not `value.bind`, and declare
the rules with `satisfies`: `required()` accepts an empty `FileList`.

```html
<als-field label="Justificatif" required="true" hint="PDF, JPG ou PNG, 2 Mo maximum.">
  <input type="file" class="form-control" accept=".pdf,.jpg,.jpeg,.png" ref="documentInput"
    files.bind="model.document & validate" />
</als-field>
```

```javascript
ValidationRules.ensure('document')
  .satisfies(files => files?.length > 0)
  .withMessage('Veuillez sélectionner un fichier.')
  .then()
  .satisfies(files => files[0].size <= 2 * 1024 * 1024)
  .withMessage('Le fichier ne doit pas dépasser 2 Mo.')
  .on(this.model);
```

> **Warning:** Aurelia only reads `files` from the input, it never writes the model value back to it. To prefill or
> clear the input from code, update the input itself (here through `ref`) as well as the model:
>
> ```javascript
> const files = new DataTransfer();
> files.items.add(new File([content], 'justificatif.pdf', { type: 'application/pdf' }));
> this.documentInput.files = files.files; // displayed file
> this.model.document = files.files; // validated value
>
> this.documentInput.value = ''; // clears the input
> this.model.document = undefined;
> ```

## `als-datepicker`

An [`input-datepicker`](./components.md#input-datepicker) with the calendar icon, to place inside an
`als-field`.

```html
<als-field label="Date de début" required="true">
  <als-datepicker value.bind="model.startDate & validate" min-date.bind="minDate"></als-datepicker>
</als-field>
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `value` | Two-way bound selected date | Calendar date `YYYY-MM-DD` (an ISO date time is also read) | None |
| `placeholder` | Text displayed when no date is selected | Any string | `''` |
| `disabled`, `readonly` | Disables the control or makes it read-only | `true` or `false` | `false` |
| `min-date`, `max-date` | Limits of the selectable dates, enforced by the calendar | Calendar date `YYYY-MM-DD` | None |
| `disabled-days` | Days of week that cannot be selected (0 is Sunday) | Array of numbers | `[]` |
| `disabled-dates` | Dates that cannot be selected | Array of calendar dates `YYYY-MM-DD` | `[]` |
| `autohide` | Closes the calendar after a selection | `true` or `false` | `true` |

## `als-multi-select`

A dropdown of checkboxes selecting several values. Place it inside an `als-field` to get the label and the validation
errors, like a native control:

```html
<als-field label="Années" required="true">
  <als-multi-select items.bind="years" value.bind="model.years & validate"></als-multi-select>
</als-field>
```

```javascript
ValidationRules.ensure('years').minItems(1).on(this.model); // `required()` accepts an empty array
```

| Attribute | Role | Possible values | Default value |
|---|---|---|---|
| `items` | The items to be displayed | Array of `{ label, value }` | `[]` |
| `value` | Two-way bound selected values | Any array | `[]` |
| `placeholder` | Text displayed when nothing is selected | Any string | `Sélectionner` |
| `disabled` | Disables the control | `true` or `false` | `false` |

## Cross-field rules

A rule may depend on another property, e.g. an end date that cannot be before the start date. `als-field` does not
know this dependency: the end date is validated when the user leaves its own field, not when the start date changes.
Revalidate the dependent property yourself, and limit the calendar to avoid the error in the first place.

```html
<als-field label="Date de début" required="true">
  <als-datepicker value.bind="model.startDate & validate"></als-datepicker>
</als-field>
<als-field label="Date de fin" required="true">
  <als-datepicker value.bind="model.endDate & validate" min-date.bind="model.startDate"></als-datepicker>
</als-field>
```

```javascript
import { BindingEngine, inject, NewInstance } from 'aurelia-framework';
import { ValidationController, ValidationRules } from 'aurelia-validation';

@inject(NewInstance.of(ValidationController), BindingEngine)
export class MyForm {
  model = { startDate: null, endDate: null };

  constructor(controller, bindingEngine) {
    this.controller = controller;
    this.bindingEngine = bindingEngine;
    ValidationRules.ensure('startDate').required()
      .ensure('endDate').required()
      // calendar dates YYYY-MM-DD: compared as strings
      .satisfies((endDate, model) => !model.startDate || endDate >= model.startDate)
      .withMessage('La date de fin ne peut pas être antérieure à la date de début.')
      .on(this.model);
  }

  activate() {
    // revalidates the end date, once entered, when the start date changes
    this.subscription = this.bindingEngine
      .propertyObserver(this.model, 'startDate')
      .subscribe(() => this.model.endDate && this.controller.validate({ object: this.model, propertyName: 'endDate' }));
  }

  deactivate() {
    this.subscription.dispose();
  }
}
```

## Deprecated components

`<als-input-number>`, `<als-input-text>`, `<als-input-password>` and `<als-select>` will be removed in a later major
version, once the applications have migrated. Replace them with a native control in an `als-field`, validated with `& validate`:

| Deprecated | Replacement |
|---|---|
| `<als-input-number type="integer">` | `<als-field><input class="form-control" input-mask="integer" value.bind="... \| formInputNumberFormat:'integer' & validate"></als-field>` (same with `decimal` or `currency`) |
| `<als-input-text>` | `<als-field><input class="form-control" value.bind="... & validate"></als-field>`, with the `email()` rule for emails |
| `<als-input-password>` | `<als-field><input type="password" class="form-control" value.bind="... & validate"><als-password-toggle></als-password-toggle></als-field>` |
| `<als-select>` | `<als-field><select class="form-select" value.bind="... & validate">...</select></als-field>` |

Their `label` attribute becomes the `label` of `als-field`, and the validation rules move to `ValidationRules`
(`is-error` and `error-message` are replaced by the aurelia-validation errors).
