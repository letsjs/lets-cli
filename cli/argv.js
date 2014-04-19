'use strict';

var path = require('path'),
    findup = require('findup'),
    version = require('./version'),
    help = require('./help'),
    logger = require('./logger');


module.exports = exports = function (argv, cwd) {
  var config;

  exports.cwd = cwd;
  exports.argv = argv;

  if(argv.v || argv.version) {
    return version(cwd);
  }

  if(argv.h || argv.help) {
    return help(argv._);
  }

  // All of the following tasks will need the local installation
  exports.requireLocalLets();
  exports.requireLetsfile();

  if(argv._.length === 2) {
    // Attach local log to CLI log
    logger.capture(exports.lets, argv);

    config = exports.loadLetsfile();
    exports.lets.runTasks(config, argv._[0], argv._[1], exports.done);
  }
};


exports.loadLetsfile = function () {
  return exports.lets.load(exports.letsfile);
};


exports.requireLocalLets = function () {
  if(exports.lets) {
    return;
  }

  try {
    exports.lets = require(path.join(findup.sync(exports.cwd, path.join('node_modules', 'lets')), 'node_modules', 'lets'));
  }
  catch (e) {
    throw new Error(exports.letsError);
  }
};


exports.requireLetsfile = function () {
  if(exports.letsfile) {
    return;
  }

  try {
    if(exports.argv.letsfile) {
      exports.letsfile = require(path.resolve(exports.cwd, exports.argv.letsfile));
    }
    else {
      exports.letsfile = require(path.join(findup.sync(exports.cwd, 'Letsfile.js'), 'Letsfile'));
    }
  }
  catch (e) {
    throw new Error(exports.letsfileError);
  }
};


exports.done = function (err) {
  if(err) {
    logger.plain('NOT OK');
  }
  else {
    logger.plain('OK');
  }

  //## Handle exiting in a centralized and testable way
  //## process.exit(err && 1 || 0);
};


/* Expose stuff for testability
============================================================================= */

exports.letsError = 'Couldn\'t find local lets. Make sure it\'s installed using `npm install lets -S`';
exports.letsfileError = 'Couldn\'t find a local Letsfile.js';

exports.lets = undefined;
exports.letsfile = undefined;
exports.cwd = undefined;
exports.argv = undefined;
