import { DateFormatValueConverter } from 'value-converters/date-format';

// the specs run in the time zone of the machine: run them with TZ=America/Guadeloupe or TZ=Pacific/Noumea to check
// that a calendar date keeps its day on both sides of UTC
describe('dateFormat', () => {
  const converter = new DateFormatValueConverter();

  describe('toView', () => {
    test.each([
      ['2024-03-15', undefined, '15/03/2024'],
      ['2024-03-15', 'MM/DD/YYYY', '03/15/2024'],
      ['2024-03-15', 'YYYY-MM-DD', '2024-03-15'],
      [new Date(2024, 2, 15), undefined, '15/03/2024']
    ])('displays %p with the %p format as %p', (value, format, text) => {
      expect(converter.toView(value, format)).toBe(text);
    });

    test('displays the local day of a date time', () => {
      const dateTime = new Date(2024, 2, 15, 23, 30).toISOString();
      expect(converter.toView(dateTime)).toBe('15/03/2024');
    });

    test.each([
      ['2024-02-31', '2024-02-31'],
      ['abc', 'abc'],
      ['', undefined],
      // eslint-disable-next-line unicorn/no-null -- a model value may be null
      [null, undefined]
    ])('displays the invalid date %p as %p', (value, text) => {
      expect(converter.toView(value)).toBe(text);
    });
  });

  describe('fromView', () => {
    test.each([
      ['15/03/2024', undefined],
      ['03/15/2024', 'MM/DD/YYYY'],
      ['2024-03-15', 'YYYY-MM-DD']
    ])('parses %p with the %p format as the calendar date 2024-03-15', (value, format) => {
      expect(converter.fromView(value, format)).toBe('2024-03-15');
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
