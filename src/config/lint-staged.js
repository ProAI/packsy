const micromatch = require('micromatch');
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

function filterDotFiles(files) {
  return micromatch.not(files, '.*').join(' ');
}

module.exports = {
  // Format and lint all javascript/typescript files.
  [`*.+(${scripts})`]: files => {
    const filteredFiles = filterDotFiles(files);

    return [`${bin} format ${filteredFiles}`, `${bin} lint ${filteredFiles}`];
  },
  // Format only all other files.
  [`*.+(${nonScripts})`]: files => {
    const filteredFiles = filterDotFiles(files);

    return [`${bin} format ${filteredFiles}`];
  },
};
