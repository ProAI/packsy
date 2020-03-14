const fs = require('fs');
const path = require('path');
const rawWhich = require('npm-which');
const readPkgUp = require('read-pkg-up');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');

// all prettier supported file types
const fileExtensions = {
  style: 'css|less|scss',
  graphql: 'graphql|gql',
  html: 'html',
  js: 'js|jsx',
  json: 'json',
  markdown: 'md|markdown|mdown|mkdn',
  mdx: 'mdx',
  ts: 'ts|tsx',
  vue: 'vue',
  yaml: 'yaml|yml',
};

// copied from https://github.com/kentcdodds/kcd-scripts/blob/master/src/utils.js
const { packageJson: pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});

const pkgDir = path.dirname(pkgPath);
const packsyDir = path.join(__dirname, '..');
const configDir = path.join(__dirname, 'config');

const which = rawWhich(packsyDir);

function resolveBin(modName) {
  return which.sync(modName);
}

function clearDirectory(dir) {
  const dirPath = path.join(pkgDir, dir);

  rimraf.sync(dirPath);
  mkdirp.sync(dirPath);
}

function copyFlowLibDef() {
  // Copy Flow library definitions if present.
  const flow = path.join(pkgDir, 'src', 'index.js.flow');

  if (fs.existsSync(flow)) {
    const filePath = path.join(pkgDir, 'dist', `${pkg.name}.cjs.js.flow`);
    fs.writeFileSync(filePath, "// @flow\n\nexport * from '../src';\n", 'utf8');
  }
}

function validatePkg() {
  const errors = [];

  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  Object.entries(deps).forEach(([name, version]) => {
    if (
      version.startsWith('file:') ||
      version.startsWith('link:') ||
      version.startsWith('github:') ||
      version.startsWith('git+ssh:') ||
      version.startsWith('git+https:') ||
      version.startsWith('git:')
    ) {
      errors.push(`Dependency "${name}" must be mapped to a version.`);
    }
  });

  if (errors.length > 0) {
    errors.forEach(error => {
      // eslint-disable-next-line no-console
      console.error(`Error in package.json: ${error}`);
    });

    return false;
  }

  return true;
}

module.exports = {
  pkgDir,
  packsyDir,
  configDir,
  resolveBin,
  pkg,
  fileExtensions,
  clearDirectory,
  copyFlowLibDef,
  validatePkg,
};
