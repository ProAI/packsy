#!/usr/bin/env node

const command = process.argv[2];

/* eslint-disable global-require */
if (command === 'build') {
  require('./build');
} else if (command === 'dev') {
  require('./dev');
} else if (command === 'format') {
  require('./format');
} else if (command === 'lint') {
  require('./lint');
} else if (command === 'precommit') {
  require('./precommit');
} else if (command === 'validate') {
  require('./validate');
} else {
  // eslint-disable-next-line no-console
  console.error(`Unknown command "${command}"`);
  process.exit(1);
}
/* eslint-enable */
