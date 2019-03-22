#!/usr/bin/env node
const spawn = require('cross-spawn');
const yargsParser = require('yargs-parser');
const { resolveBin, fileExtensions } = require('../utils');

const customArgs = process.argv.slice(process.argv[2] === 'format' ? 3 : 2);

const bin = resolveBin('prettier');
const args = [...customArgs];

if (!customArgs.includes('--no-write')) {
  args.push('--write');
}

// format all files if no files are specified
if (yargsParser(args)._.length === 0) {
  args.push(`**/*.+(${fileExtensions.join('|')})`);
}

const result = spawn.sync(bin, args, { stdio: 'inherit' });

process.exit(result.status);
