const { Readable } = require('stream');

const { argsToQueryResult } = require('./argsToQueryResult');

describe('argsToQueryResult', () => {
  describe.each(['1', '2'])('lib %s', (lib) => {
    it.each([
      { opts: [], query: 'x', input: { x: 100 }, expected: '100' },
      { opts: [], query: 'x', input: { x: 'oak' }, expected: '"oak"' },
      { opts: ['-u'], query: 'x', input: { x: 'oak' }, expected: 'oak' },
      { opts: [], query: 'x', input: {}, expected: 'null' },
    ])('works for test %#', async (test) => {
      // When

      const queryResult = await argsToQueryResult(
        ['ignored', 'ignored', ...test.opts, '-l', lib, test.query],
        Readable.from(JSON.stringify(test.input)),
      );

      // Then

      expect(queryResult).toEqual(test.expected);
    });
  });
});
