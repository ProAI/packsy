const fs = require('fs');
const path = require('path');
const which = require('which');
const readPkgUp = require('read-pkg-up');

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
const { pkg, path: pkgPath } = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
});

const rootDir = path.dirname(pkgPath);
const configDir = path.join(__dirname, 'config');

function resolveBin(
  modName,
  { executable = modName, cwd = process.cwd() } = {},
) {
  let pathFromWhich;

  try {
    pathFromWhich = fs.realpathSync(which.sync(executable));
  } catch (_error) {
    // ignore _error
  }

  try {
    const modPkgPath = require.resolve(`${modName}/package.json`);
    const modPkgDir = path.dirname(modPkgPath);

    // eslint-disable-next-line
    const { bin } = require(modPkgPath);

    const binPath = typeof bin === 'string' ? bin : bin[executable];
    const fullPathToBin = path.join(modPkgDir, binPath);

    if (fullPathToBin === pathFromWhich) {
      return executable;
    }

    return fullPathToBin.replace(cwd, '.');
  } catch (error) {
    if (pathFromWhich) {
      return executable;
    }

    throw error;
  }
}

function resolvePacksy() {
  if (pkg.name === 'packsy') {
    const packsyPath = path.join(process.cwd(), 'src/scripts/packsy.js');
    return require.resolve(packsyPath).replace(process.cwd(), '.');
  }

  return resolveBin('packsy');
}

// Check package.json for unreverted changes that were needed for development.
function validatePkg() {
  const errors = [];

  const mainEntry = `dist/${pkg.name}.cjs.js`;
  if (pkg.main !== mainEntry) {
    errors.push(`"main" field must be "${mainEntry}"`);
  }

  const moduleEntry = `dist/${pkg.name}.esm.js`;
  if (pkg.module !== moduleEntry) {
    errors.push(`"module" field must be "${moduleEntry}"`);
  }

  const deps = Object.assign({}, pkg.dependencies, pkg.devDependencies);
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

    process.exit(1);
  }
}

module.exports = {
  rootDir,
  configDir,
  resolveBin,
  resolvePacksy,
  pkg,
  fileExtensions,
  validatePkg,
};
