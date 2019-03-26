const path = require('path');
const { fileExtensions } = require('../utils');

const scripts = `${fileExtensions.js}|${fileExtensions.ts}`;
const nonScripts = Object.values(fileExtensions)
  .filter(value => {
    return value !== fileExtensions.js && value !== fileExtensions.ts;
  })
  .join('|');

const packsyDir = path.join(__dirname, '../..');

// Notice: We don't need to resolveBin() packsy, because lint staged uses
// npm-which internally to resolve binaries.
const bin =
  packsyDir === process.cwd() ? 'node ./src/scripts/packsy.js' : 'packsy';

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
