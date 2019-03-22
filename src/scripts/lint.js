#!/usr/bin/env node
const spawn = require('cross-spawn');
const yargsParser = require('yargs-parser');
const { resolveBin } = require('../utils');

const bin = resolveBin('eslint');
const args = process.argv.slice(process.argv[2] === 'lint' ? 3 : 2);

// lint all files if no files are specified
if (yargsParser(args)._.length === 0) {
  args.push('.');
}

const result = spawn.sync(bin, args, { stdio: 'inherit' });

process.exit(result.status);
