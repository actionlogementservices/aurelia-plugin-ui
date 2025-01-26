# Module `elements/auto-complete/auto-complete-controller`

![category:autocomplete](https://img.shields.io/badge/category-autocomplete-3b631b.svg?style=flat-square)



[Source file](..\src\elements\auto-complete\auto-complete-controller.js)

# Class `AutoCompleteController`

Imlements a controller that retrieves data on the fly for an &#x27;auto-complete&#x27; custom element.

## Methods

### `configure(search, buildItemModel)`

![modifier: public](images/badges/modifier-public.png)

Creates an instance of the autocomplete controller.

Parameters | Type | Description
--- | --- | ---
__search__ | `Search.<T>` | *query function that retrieves item to display*
__buildItemModel__ | `ItemModelBuilder.<T, U>` | *build the model of type &#x60;U&#x60; to be displayed based on the response object of type &#x60;T&#x60; retrieved by the query function*

---

### `search(searchText) ► Promise<(U | T)[]>`

![modifier: public](images/badges/modifier-public.png)

Searches the specified text and return corresponding results to display.

Parameters | Type | Description
--- | --- | ---
__searchText__ | `string` | *text to search*
__*return*__ | `Promise<(U \| T)[]>` | *corresponding results*

---

### `buildItemModel(item) ► undefined`

![modifier: public](images/badges/modifier-public.png)

Builds the model to be displayed.

Parameters | Type | Description
--- | --- | ---
__item__ | `T` | *item retrieved by the query function*
__*return*__ | `undefined` | *model to be displayed*

---
