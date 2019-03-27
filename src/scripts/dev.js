#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const rimraf = require('rimraf');
const { resolveBin, pkgDir, configDir } = require('../utils');

const customArgs = process.argv.slice(process.argv[2] === 'dev' ? 3 : 2);
const relativePkgDir = path.relative(process.cwd(), pkgDir);

// Clear lib directory.
rimraf.sync(path.join(pkgDir, 'lib'));
fs.mkdirSync(path.join(pkgDir, 'lib'));

// Link Flow library definitions if present.
const flow = path.join(pkgDir, 'src', 'index.js.flow');
if (fs.existsSync(flow)) {
  const flowCopy = path.join(pkgDir, 'lib', 'index.js.flow');
  fs.writeFileSync(flowCopy, "// @flow\n\nexport * from '../src';\n", 'utf8');
}

const bin = resolveBin('babel');
const args = [
  '--config-file',
  path.join(configDir, 'babel.js'),
  '--out-dir',
  path.join(relativePkgDir, 'lib'),
  path.join(relativePkgDir, 'src'),
  ...customArgs,
];

if (!customArgs.includes('--no-watch')) {
  args.push('--watch');
}

const result = spawn.sync(bin, args, { stdio: 'inherit' });

process.exit(result.status);
