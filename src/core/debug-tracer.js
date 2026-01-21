/* eslint-disable no-console */
/**
 * Sets debugging trace for the specified instance.
 * @param {any} instance class instance
 */
export function setTraceDebugger(instance) {
  const proto = Object.getPrototypeOf(instance);
  const uniqueId = instance?._container?.id ?? instance?.uniqueId ?? '?';
  for (const name of Object.getOwnPropertyNames(proto)) {
    const function_ = instance[name];
    if (name === 'constructor') continue;
    if (typeof function_ !== 'function') continue;

    // Only wrap once
    if (function_.__isTraced) continue;

    const wrapped = (...arguments_) => {
      const id = `${instance.constructor.name}(${uniqueId})#${name}`;
      console.groupCollapsed(`[TRACE] ${id}`);
      console.log('args:', arguments_);
      try {
        const result = function_.apply(instance, arguments_);
        console.log('result:', result);
        console.groupEnd();
        return result;
      } catch (error) {
        console.error('error:', error);
        console.groupEnd();
        throw error;
      }
    };
    wrapped.__isTraced = true;
    instance[name] = wrapped;
  }
}
