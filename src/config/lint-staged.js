const { resolvePacksy, fileExtensions } = require('../utils');

const bin = resolvePacksy();

const scripts = `${fileExtensions.js}|${fileExtensions.ts}`;
const nonScripts = Object.values(fileExtensions)
  .filter(value => {
    return value !== fileExtensions.js && value !== fileExtensions.ts;
  })
  .join('|');

module.exports = {
  linters: {
    // Format and lint all javascript/typescript files.
    [`*.+(${scripts})`]: [`node ${bin} format`, `node ${bin} lint`, 'git add'],
    // Format only all other files.
    [`*.+(${nonScripts})`]: [`node ${bin} format`, 'git add'],
  },
  // Ignore all dot files.
  ignore: ['.*'],
};
