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

  // the value is rounded to the nearest, as the input-mask does: 12,345 is masked as 12,35
  test.each([
    [12.345, 'decimal', '12,35'],
    [12.344, 'decimal', '12,34'],
    [12.9, 'integer', '13'],
    [1500.99, 'currency', '1 501 €']
  ])('rounds %d to the nearest as a %s', (value, type, text) => {
    expect(converter.toView(value, type)).toBe(text);
  });

  test.each(['', 'abc', '_'])('parses %p as undefined', value => {
    expect(converter.fromView(value)).toBeUndefined();
  });
});
