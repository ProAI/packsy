#!/usr/bin/env node
const path = require('path');
const spawn = require('cross-spawn');
const {
  resolveBin,
  configDir,
  copyFlowLibDef,
  clearDirectory,
} = require('../utils');

const customArgs = process.argv.slice(process.argv[2] === 'build' ? 3 : 2);

const formats = ['esm', 'cjs', 'umd', 'umd.min'];

// Clear dist directory.
clearDirectory('dist');

// Copy Flow library definitions.
copyFlowLibDef();

// Setup commands for building bundle concurrently.
const crossEnvBin = resolveBin('cross-env');
const rollupBin = resolveBin('rollup');
const rollupArgs = [
  '--config',
  path.join(configDir, 'rollup.js'),
  ...customArgs,
];

const bin = resolveBin('concurrently');
const args = [
  '--raw',
  ...formats.map(format => {
    const formatArgs = [
      crossEnvBin,
      `BUILD_FORMAT=${format}`,
      rollupBin,
      ...rollupArgs,
    ];

    return JSON.stringify(formatArgs.join(' '));
  }),
];

const result = spawn.sync(bin, args, { stdio: 'inherit' });

// Automatically stage .size-snapshot.json
spawn.sync('git', ['add', '.size-snapshot.json']);

process.exit(result.status);
