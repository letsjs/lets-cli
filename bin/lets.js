#!/usr/bin/env node

'use strict';

var cli = require('../cli'),
    argv = require('optimist').argv;

cli.argv(argv, process.cwd());
