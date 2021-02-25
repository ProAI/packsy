const path = require('path');
const babel = require('rollup-plugin-babel');
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const { sizeSnapshot } = require('rollup-plugin-size-snapshot');
const camelcase = require('lodash.camelcase');
const { pkg, pkgDir } = require('../utils');
const babelConfig = require('./babel');

const capitalize = (s) => s[0].toUpperCase() + s.slice(1);

const relativePkgDir = path.relative(process.cwd(), pkgDir);
const input = path.join(relativePkgDir, 'src/index.js');
const distDir = path.join(relativePkgDir, 'dist');

const peerDeps = Object.keys(pkg.peerDependencies || {});
const deps = Object.keys(pkg.dependencies || {});

const makeExternalTest = (config) => {
  const external = config.format === 'umd' ? peerDeps : deps.concat(peerDeps);
  const externalPattern = new RegExp(`^(${external.join('|')})($|/)`);

  return (id) => {
    const isDep = externalPattern.test(id);

    if (config.format === 'umd') {
      return isDep;
    }

    const isNodeModule = id.includes('node_modules');
    const isRelative = id.startsWith('.');

    return isDep || (!isRelative && !path.isAbsolute(id)) || isNodeModule;
  };
};

function buildCJS() {
  return {
    input,
    output: {
      file: `${distDir}/${pkg.name}.cjs.js`,
      format: 'cjs',
    },
    // For cjs all dependencies are external.
    external: makeExternalTest({ format: 'cjs' }),
    plugins: [
      babel(babelConfig),
      nodeResolve(),
      json(),
      sizeSnapshot({ printInfo: false }),
    ],
  };
}

function buildESM() {
  return {
    input,
    output: {
      file: `${distDir}/${pkg.name}.esm.js`,
      format: 'esm',
    },
    // For esm all dependencies are external.
    external: makeExternalTest({ format: 'esm' }),
    plugins: [
      babel(babelConfig),
      nodeResolve(),
      json(),
      sizeSnapshot({ printInfo: false }),
    ],
  };
}

function buildUMD(config) {
  const globals = peerDeps.reduce((globalDeps, dep) => {
    // eslint-disable-next-line no-param-reassign
    globalDeps[dep] = capitalize(camelcase(dep));

    return globalDeps;
  }, {});

  const minified = config.env === 'production' ? '.min' : '';

  return {
    input,
    output: {
      name: pkg.name,
      file: `${distDir}/${pkg.name}.umd${minified}.js`,
      format: 'umd',
      globals,
    },
    // For umd only peer dependencies are external.
    external: makeExternalTest({ format: 'umd' }),
    plugins: [
      babel({ exclude: /node_modules/, ...babelConfig }),
      nodeResolve(),
      commonjs({ include: /node_modules/ }),
      json(),
      replace({
        values: { 'process.env.NODE_ENV': JSON.stringify(config.env) },
        preventAssignment: true,
      }),
      sizeSnapshot({ printInfo: false }),
      config.env === 'production' && terser(),
    ],
  };
}

function makeConfig() {
  if (process.env.BUILD_FORMAT === 'cjs') {
    return buildCJS();
  }

  if (process.env.BUILD_FORMAT === 'esm') {
    return buildESM();
  }

  if (process.env.BUILD_FORMAT === 'umd') {
    return buildUMD({ env: 'development' });
  }

  if (process.env.BUILD_FORMAT === 'umd.min') {
    return buildUMD({ env: 'production' });
  }

  return [
    buildCJS(),
    buildESM(),
    buildUMD({ env: 'development' }),
    buildUMD({ env: 'production' }),
  ];
}

const config = makeConfig();

export default config;
