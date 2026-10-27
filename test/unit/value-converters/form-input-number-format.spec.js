import { FormInputNumberFormatValueConverter } from 'value-converters/form-input-number-format';

describe('formInputNumberFormat', () => {
  const converter = new FormInputNumberFormatValueConverter();

  test.each([
    [1234, 'integer'],
    [1234.56, 'decimal'],
    [1234, 'currency']
  ])('formats %d as %s and parses it back', (value, type) => {
    expect(converter.fromView(converter.toView(value, type))).toBe(value);
  });

  test.each(['', 'abc', '_'])('parses %p as undefined', value => {
    expect(converter.fromView(value)).toBeUndefined();
  });
});
