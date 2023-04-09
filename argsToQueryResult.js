const fs = require('fs');

const { Command } = require('commander');

Object.assign(exports, { argsToQueryResult });

const progName = 'jpc';

const extraHelp = `
Valid values for <library>:

  1 = jmespath (the official JavaScript library)
  2 = @metrichor/jmespath`;

/**
 * Calls process.exit in case of bad input.
 *
 * @param {string[]} args
 * @param {Stream} stream
 * @return {string}
 */
async function argsToQueryResult(args, stream) {
  const program = new Command();

  program
    .option(
      '-u, --unquoted',
      "print result without quotes if it's a string",
      false,
    )
    .option(
      '-l, --library <library>',
      'JavaScript library to use for JMESPath',
      '1',
    )
    .argument('<query>', 'JMESPath query');

  program.addHelpText('after', extraHelp);

  program.parse(args);

  if (program.args.length > 1) {
    console.error(`${progName}: fatal error: too many arguments`);
    process.exit(1);
  }

  const lib = program.opts().library;
  if (lib !== '1' && lib !== '2') {
    console.error(`${progName}: fatal error: invalid library: ${lib}`);
    process.exit(1);
  }

  if (stream.isTTY) {
    console.warn('Warning: input stream is a terminal');
  }

  let inputString = '';
  stream.on('data', (x) => {
    inputString += x.toString();
  });
  await new Promise((resolve) => {
    stream.on('end', resolve);
  });

  let input;
  try {
    input = JSON.parse(inputString);
  } catch (e) {
    console.error(`${progName}: fatal error: invalid JSON: ${e.message}`);
    process.exit(1);
  }

  const pkg = [, 'jmespath', '@metrichor/jmespath'][lib];

  return runQuery(pkg, input, program.args[0], program.opts().unquoted);
}

/**
 * @return {string}
 */
function runQuery(pkg, input, query, unquoted) {
  const tmp = require(pkg);
  const search = tmp.search.bind(tmp);
  const queryResult = search(input, query);
  return unquoted && typeof queryResult === 'string'
    ? queryResult
    : JSON.stringify(queryResult, null, 2);
}
