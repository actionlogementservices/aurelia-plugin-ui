# Module `elements/als-footer/als-footer`

![category:element](https://img.shields.io/badge/category-element-3b631b.svg?style=flat-square)



[Source file](../src/elements/als-footer/als-footer.js)

# Class `AlsFooter`

Implements the **&#x60;als-footer&#x60; custom element** that displays a generic footer with a list of links.

## Methods

### `getExternalLinkLabel(label) ► string`

![modifier: public](images/badges/modifier-public.png)

Builds an accessible label for links that open in a new tab.

Parameters | Type | Description
--- | --- | ---
__label__ | `string` | *The visible text for the link.*
__*return*__ | `string` | *A screen-reader-friendly label.*

---

## Members

Name | Type | Description
--- | --- | ---
__type__ | `'default'\|'compact'` | *The type of footer to display. @type {&#x27;default&#x27;|&#x27;compact&#x27;}*
__logoUrl__ | `string` | *URL for the logo link. @type {string}*
__accessibilityText__ | `string` | *Text for the accessibility conformity link. @type {string}*
__accessibilityUrl__ | `string` | *URL for the accessibility conformity link. @type {string}*
__links__ | `Array<{ text: string, url: string }>` | *Links displayed in the footer. @type {Array&lt;{ text: string, url: string }&gt;}*
__hideSocialMediaLinks__ | `boolean` | *Whether the social media links block should be hidden. @type {boolean}*
__youtubeUrl__ | `string` | *URL of the YouTube page. @type {string}*
__twitterUrl__ | `string` | *URL of the Twitter/X page. @type {string}*
__linkedinUrl__ | `string` | *URL of the LinkedIn page. @type {string}*
