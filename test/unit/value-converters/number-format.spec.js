import { NumberFormatValueConverter } from 'value-converters/number-format';

describe('numberFormat', () => {
  const converter = new NumberFormatValueConverter();

  test.each([
    [1234.5, undefined, '1 234,50'],
    ['1234.5', undefined, '1 234,50'],
    [-3, undefined, '-3,00'],
    [1234.56, { digits: 0, suffix: ' €' }, '1 234,56 €'],
    [1234.5, { locale: 'en-US' }, '1,234.50']
  ])('formats %p with %p as %p', (value, options, text) => {
    expect(converter.toView(value, options)).toBe(text);
  });

  // eslint-disable-next-line unicorn/no-null -- a model value may be null
  test.each([null, undefined, ''])('formats %p as undefined', value => {
    expect(converter.toView(value)).toBeUndefined();
  });
});
