#!/usr/bin/env node
const spawn = require('cross-spawn');
const { resolveBin, validatePkg } = require('../utils');

// Validate package.json first.
if (!validatePkg()) {
  process.exit(1);
}

// Lint files second.
const bin = resolveBin('eslint');
const result = spawn.sync(bin, ['.'], { stdio: 'inherit' });

// TODO: Run tests.

process.exit(result.status);
