const { packsyDir, fileExtensions } = require('../utils');

const scripts = `${fileExtensions.js}|${fileExtensions.ts}`;
const nonScripts = Object.values(fileExtensions)
  .filter(value => {
    return value !== fileExtensions.js && value !== fileExtensions.ts;
  })
  .join('|');

function resolvePacksy() {
  // If the process current working directory is equal to the packsy directory,
  // we'll use node to execute packsy script.
  if (packsyDir === process.cwd()) {
    return 'node ./src/scripts/packsy.js';
  }

  // Otherwise we don't need to resolve packsy binary, because lint-staged uses
  // npm-which internally to resolve binaries.
  return 'packsy';
}

const bin = resolvePacksy();

module.exports = {
  linters: {
    // Format and lint all javascript/typescript files.
    [`*.+(${scripts})`]: [`${bin} format`, `${bin} lint`, 'git add'],
    // Format only all other files.
    [`*.+(${nonScripts})`]: [`${bin} format`, 'git add'],
  },
  // Ignore all dot files.
  ignore: ['.*'],
};
