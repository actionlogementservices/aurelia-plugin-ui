# Module `elements/auto-complete/address-auto-complete`

![category:autocomplete](https://img.shields.io/badge/category-autocomplete-blue.svg?style=flat-square)



[Source file](..\src\elements\auto-complete\address-auto-complete.js)

# Class `AddressAutoComplete`

Implements the **&#x60;address-auto-complete&#x60; custom element** that provides auto completion upon the BAN (*Base Adresse Nationale*) api.

## Constructors


### `AddressAutoComplete(configuration, createHttpClient, controller)`

Creates an instance of the &#x60;address-auto-complete&#x60; custom element.

Parameters | Type | Description
--- | --- | ---
__configuration__ | `AureliaConfiguration` | *application configuration*
__createHttpClient__ | `HttpClientFactory` | *http client factory*
__controller__ | [AutoCompleteController](src-elements-auto-complete_auto-complete-controller.md) | *autocomplete controller that retrieves data on the fly*

---

## Methods

### `setMode()`

![modifier: public](images/badges/modifier-public.png)

Defines the query mode.

---

### `searchAdresse(query, type, limit, postcode, cityCode) ► Promise.<Array.<Adresse>>`

![modifier: public](images/badges/modifier-public.png)

Queries the BAN api.

Parameters | Type | Description
--- | --- | ---
__query__ | `string` | *text to search for*
__type__ | `string` | *type of query*
__limit__ | `number` | *max number of responses*
__postcode__ | `string` | *zip code*
__cityCode__ | `string` | *city code*
__*return*__ | `Promise.<Array.<Adresse>>` | *the list of corresponding address*

---

## Members

Name | Type | Description
--- | --- | ---
__mode__ | `AddressMode` | *The query mode of the BAN api. @type {AddressMode}*
__value__ | [Adresse](src-elements-auto-complete_adresse.md) | *The resulting selected address. @type {Adresse}*
__placeholder__ | `string` | *The place holder text. @type {string}*
__disabled__ | `boolean` | *Enable/Disable the custom element to prevent user modification. @type {boolean}*
__addressAutoCompleteController__ | `AutoCompleteController.<Adresse>` | **
___client__ | `HttpClient` | **
