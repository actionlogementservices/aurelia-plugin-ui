import { Container } from 'aurelia-dependency-injection';

/**
 * Defines common decorators.
 * @module
 * @category internal
 */

/**
 * Adds a fromObject static method on the decorated class that creates an instance of this class with the specified parameters.
 * @type { (constructor: Function) => void }
 * @example
 * \@fromObject
 * export class Section {}
 * ...
 * const section = Section.fromObject({settings: ...}, {data: ...});
 */
export const fromObject = constructor => {
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
};
