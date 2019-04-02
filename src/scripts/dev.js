#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const spawn = require('cross-spawn');
const {
  pkg,
  pkgDir,
  resolveBin,
  configDir,
  copyFlowLibDef,
  clearDirectory,
} = require('../utils');

const customArgs = process.argv.slice(process.argv[2] === 'dev' ? 3 : 2);
const relativePkgDir = path.relative(process.cwd(), pkgDir);

// Clear dist and lib directory.
clearDirectory('dist');
clearDirectory('lib');

// Create entry files.
fs.writeFileSync(
  path.join(pkgDir, 'dist', `${pkg.name}.cjs.js`),
  "module.exports = require('../lib/index.js');\n",
  'utf8',
);
fs.writeFileSync(
  path.join(pkgDir, 'dist', `${pkg.name}.esm.js`),
  "module.exports = require('../lib/index.js');\n",
  'utf8',
);

// Copy Flow library definitions.
copyFlowLibDef();

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
