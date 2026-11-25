# Module `elements/als-user-menu/als-user-menu`

![category:element](https://img.shields.io/badge/category-element-3b631b.svg?style=flat-square)



[Source file](../src/elements/als-user-menu/als-user-menu.js)

# Class `AlsUserMenu`

Implements the **&#x60;als-user-menu&#x60; custom element** that displays the user&#x27;s initials and a dropdown of account actions.
Each item is a link when &#x60;href&#x60; is set, otherwise &#x60;click&#x60; is called.

## Members

Name | Type | Description
--- | --- | ---
__initials__ | `string` | *Initials of the user displayed in the avatar. @type {string}*
__label__ | `string` | *Label displayed below the avatar. @type {string}*
__items__ | `AlsUserMenuItem[]` | *Menu items, &#x60;icon&#x60; being a bootstrap-icons class (e.g. &#x60;bi-x-circle&#x60;). @type {AlsUserMenuItem[]}*
