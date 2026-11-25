import { DateFormatValueConverter } from 'value-converters/date-format';

describe('dateFormat', () => {
  const converter = new DateFormatValueConverter();

  describe('toView', () => {
    test.each([
      ['2024-03-15T12:00:00Z', undefined, '15/03/2024'],
      ['2024-03-15T12:00:00Z', 'MM/DD/YYYY', '03/15/2024']
    ])('displays %p with the %p format as %p', (value, format, text) => {
      expect(converter.toView(value, format)).toBe(text);
    });

    test.each([
      ['abc', 'abc'],
      ['', undefined],
      // eslint-disable-next-line unicorn/no-null -- a model value may be null
      [null, undefined]
    ])('displays the invalid date %p as %p', (value, text) => {
      expect(converter.toView(value)).toBe(text);
    });
  });

  describe('fromView', () => {
    // the ISO string is the local midnight of the date: its UTC day depends on the time zone
    test.each([
      ['15/03/2024', undefined],
      ['03/15/2024', 'MM/DD/YYYY'],
      ['2024-03-15', 'YYYY-MM-DD']
    ])('parses %p with the %p format as the 15th of March 2024', (value, format) => {
      const date = new Date(converter.fromView(value, format));
      expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2024, 2, 15]);
    });

    test.each([
      ['31/02/2024', '31/02/2024'],
      ['abc', 'abc'],
      ['', undefined]
    ])('keeps the invalid date %p as %p', (value, result) => {
      expect(converter.fromView(value)).toBe(result);
    });

    test('displays back the parsed date', () => {
      expect(converter.toView(converter.fromView('15/03/2024'))).toBe('15/03/2024');
    });
  });
});
