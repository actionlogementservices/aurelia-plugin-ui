[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm package](https://img.shields.io/npm/v/%40actionlogementservices%2Faurelia-plugin-ui)](https://www.npmjs.com/package/@actionlogementservices/aurelia-plugin-ui)

# `@actionlogementservices/aurelia-plugin-ui`

An Aurelia plugin that provides **custom elements** and **ui services** for **aurelia v1** applications on top of **[Bootstrap 5](https://getbootstrap.com/)**.

## Description

This plugin provides UI services (dialogs, toasts, screen lock), selection and auto-complete elements, form fields
validated with [aurelia-validation](https://aurelia.io/docs/plugins/validation), a table, page layout elements and the
Action Logement Bootstrap theme.

## Installation

1. **Ensure** your **aurelia v1** application is using **Bootstrap 5** and **Bootstrap icons 1**.

1. **Install** the plugin:

   ```node
   npm install @actionlogementservices/aurelia-plugin-ui
   ```

1. **Register** the plugin in aurelia:

   ```javascript
   // in your main.js or main.ts
   export function configure(aurelia) {
     aurelia.use
       .standardConfiguration()
       .plugin(PLATFORM.moduleName('@actionlogementservices/aurelia-plugin-ui'))
   ```

1. **Import** the theme, which compiles Bootstrap with the Action Logement colors (brand colors, error `$danger`, field borders, focus ring of the controls and links):

   ```scss
   // your own overrides go first: the theme variables are !default, so the ones you set first win
   @import '@actionlogementservices/aurelia-plugin-ui/dist/styles/scss/theme.scss';
   ```

   `theme.scss` chains `bootstrap/scss/functions`, `override-variables.scss`, `bootstrap/scss/bootstrap` and `override-components.scss`. If your app builds its own Bootstrap pipeline (e.g. to merge `$theme-colors` or to use Bootstrap functions in its variables), import these files in the same order instead, `bootstrap/scss/functions` first since the theme derives colors with `shade-color()`, and `bootstrap/scss/mixins` before `override-components.scss`.

   Without the theme, the components fall back on the Bootstrap defaults.

## Documentation

| Guide | Content |
|---|---|
| [Services](./doc/guides/services.md) | `DialogService` (modal and offcanvas dialogs), `ToastService`, `LockService` and the `<lock>` element |
| [Selection elements](./doc/guides/selects.md) | `simple-select`, `filterable-select`, `badges-select`, and the `selected-*` attributes shared with the auto-complete elements |
| [Auto-complete elements](./doc/guides/auto-complete.md) | `auto-complete`, `badges-auto-complete`, `address-auto-complete` and the `AutoCompleteController` |
| [Forms](./doc/guides/forms.md) | Validation setup, `als-field`, native inputs (`formInputNumberFormat`, `input-filter`, `als-password-toggle`, files), `als-datepicker`, `als-multi-select`, cross-field rules, deprecated components |
| [Other components](./doc/guides/components.md) | `input-datepicker`, `dateFormat`, `input-mask`, `numberFormat`, `cleanInputMask`, `simple-table`, `als-pre-login`, `als-footer`, `als-user-menu`, `breadcrumbs`, `environment-ribbon`, `loading-indicator`, `als-dropdown`, `no-submit`, `als-gtag` |
| [Migrating to 6.0.0](./doc/guides/migration-6.md) | Breaking and visible changes of the 6.0.0 version, and how to migrate |
| [API reference](./doc/toc.md) | Classes, methods and functions, generated from the JSDoc with `npm run doc` |

## Compatibility

This plugin has been tested on aurelia v1 with **webpack**.
The following peer dependencies are required:

- `bootstrap 5.3.3`,
- `bootstrap-icons 1.11.3`,
  and if using the `address-auto-complete` element:
- `aurelia-fetch-client 1.8.2`,
- `aurelia-configuration 2.0.0`.
- `aurelia-validation 2.0.0`

## Release

The package is published on npm by the `Release` GitHub workflow, with npm trusted publishing (no npm token is stored in GitHub):

1. In your pull request, bump the version with `npm run bump -- <major|minor|patch|prerelease>` (updates `package.json` and `package-lock.json` only).
1. When the pull request is merged on `main`, the workflow runs the tests and **stages** the new version on npm.
   Prerelease versions (e.g. `5.2.0-0`) are staged with the `next` dist-tag.
1. The workflow creates a draft GitHub release and an issue assigned to the person who merged, as a reminder to:
   - approve the staged version in the **Staged Packages** tab of the [npm package](https://www.npmjs.com/package/@actionlogementservices/aurelia-plugin-ui) (2FA required),
   - publish the draft GitHub release, which creates the git tag,
   - close the issue.

If the staged version is rejected, delete the draft release and close the issue.
