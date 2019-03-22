#!/usr/bin/env node
const { validatePkg } = require('../utils');

// Validate package.json first.
validatePkg();

// Build bundle second.
require('./build.js');
