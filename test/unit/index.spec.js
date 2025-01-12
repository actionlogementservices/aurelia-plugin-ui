/* eslint-disable spaced-comment */
/* eslint-disable unicorn/prevent-abbreviations */
import { configure } from '../../src/index';

const mockAurelia = { globalResources: jest.fn(() => {}) };

describe('index', () => {
  test('configure() registers custom elements globally', () => {
    configure(mockAurelia);
    expect(mockAurelia.globalResources).toHaveBeenCalled();
  });
});
