import { CleanInputMaskValueConverter } from 'value-converters/clean-input-mask';

describe('cleanInputMask', () => {
  const converter = new CleanInputMaskValueConverter();

  test.each([
    ['1 234', 1234],
    ['1 234,56 €', 1234.56],
    ['12,5 %', 12.5],
    ['1_234', 1234],
    ['-12', -12]
  ])('parses %p as %p', (value, number) => {
    expect(converter.fromView(value)).toBe(number);
  });

  test.each(['', '  ', 'abc'])('parses %p as undefined', value => {
    expect(converter.fromView(value)).toBeUndefined();
  });
});
