# Module `core/decorators`

![category:internal](https://img.shields.io/badge/category-internal-6b6b6b.svg?style=flat-square)

Defines common decorators.

[Source file](..\src\core\decorators.js)

## Functions

### `fromObject(source) ► any`

![modifier: private](images/badges/modifier-private.png)



Parameters | Type | Description
--- | --- | ---
__source__ | `any` | *the source properties to build the instance upon*
__*return*__ | `any` | *the resulting instance of the correspond type*

---

## Constants

### `fromObject`

![modifier: public](images/badges/modifier-public.png) ![modifier: static](images/badges/modifier-static.png)

Adds a fromObject static method on the decorated class that creates an instance of this class with the specified parameters.

#### Value

```javascript
constructor => {
  const container = Container.instance ?? new Container();
  // @ts-ignore
  container.registerTransient(constructor);
  Object.assign(constructor, {
    /**
     * @param {...any} source the source properties to build the instance upon
     * @returns {any} the resulting instance of the correspond type
     */
    fromObject: (...source) => Object.assign(container.get(constructor), ...source)
  });
}
```

#### Examples

```javascript
@fromObject
export class Section {}
...
const section = Section.fromObject({settings: ...}, {data: ...});
```

---
