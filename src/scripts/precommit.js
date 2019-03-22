#!/usr/bin/env node
const path = require('path');
const spawn = require('cross-spawn');
const { resolveBin, validatePkg, configDir } = require('../utils');

const customArgs = process.argv.slice(process.argv[2] === 'pre-commit' ? 3 : 2);

if (!customArgs.includes('--valid-config')) {
  const isPackageJsonStaged = Boolean(
    spawn
      .sync('git', ['diff', '--cached', '--name-only', 'package.json'])
      .stdout.toString(),
  );

  // Validate package.json if file is staged.
  if (isPackageJsonStaged) {
    // Prevent that staged version differs from local version.
    spawn.sync('git', ['add', 'package.json']);

    validatePkg();
  }
}

const bin = resolveBin('lint-staged');
const args = [
  '--config',
  path.join(configDir, 'lint-staged.js'),
  ...customArgs.filter(arg => arg !== '--valid-config'),
];

const result = spawn.sync(bin, args, { stdio: 'inherit' });

process.exit(result.status);
