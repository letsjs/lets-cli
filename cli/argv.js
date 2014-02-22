'use strict';

var path = require('path'),
    findup = require('findup'),
    version = require('./version'),
    logger = require('./logger');


module.exports = exports = function (argv, cwd) {
  var config;

  if(argv.v || argv.version) {
    return version(cwd);
  }

  // All of the following tasks will need the local installation
  exports.requireLocalLets(cwd);
  exports.requireLetsfile(cwd);

  if(argv._.length === 2) {
    config = exports.loadLetsfile(cwd);
    exports.lets.runTasks(config, argv._[0], argv._[1], exports.done);
  }
};


exports.loadLetsfile = function () {
  return exports.lets.load(exports.letsfile);
};


exports.requireLocalLets = function (cwd) {
  if(exports.lets) {
    return;
  }

  try {
    exports.lets = require(path.join(findup.sync(cwd, path.join('node_modules', 'lets')), 'node_modules', 'lets'));
  }
  catch (e) {
    throw new Error(exports.letsError);
  }
};


exports.requireLetsfile = function (cwd) {
  if(exports.letsfile) {
    return;
  }

  try {
    exports.letsfile = require(path.join(findup.sync(cwd, 'Letsfile.js'), 'Letsfile'));
  }
  catch (e) {
    throw new Error(exports.letsfileError);
  }
};


exports.done = function (err) {
  if(err) {
    logger.error(err);
  }
  else {
    logger.log('OK');
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
