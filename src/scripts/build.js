#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const { pkg, resolveBin, rootDir, configDir } = require('../utils');

const customArgs = process.argv.slice(
  process.argv[2] === 'build' || process.argv[2] === 'prepublish' ? 3 : 2,
);

const formats = ['esm', 'cjs', 'umd', 'umd.min'];

// Clear dist directory.
rimraf.sync(path.join(rootDir, 'dist'));
fs.mkdirSync(path.join(rootDir, 'dist'));

// Link Flow library definitions if present.
const flow = path.join(rootDir, 'src', 'index.js.flow');
if (fs.existsSync(flow)) {
  const flowCopy = path.join(rootDir, 'dist', `${pkg.name}.cjs.js.flow`);
  fs.writeFileSync(flowCopy, "// @flow\n\nexport * from '../src';\n", 'utf8');
}

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
      'node',
      crossEnvBin,
      `BUILD_FORMAT=${format}`,
      rollupBin,
      ...rollupArgs,
    ];

    return JSON.stringify(formatArgs.join(' '));
  }),
];

const result = spawn.sync(bin, args, { stdio: 'inherit' });

process.exit(result.status);
