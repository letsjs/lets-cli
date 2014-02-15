'use strict';

var path = require('path'),
    findup = require('findup');


module.exports = exports = function (argv, cwd) {
  try {
    exports.lets = require(path.join(findup.sync(cwd, path.join('node_modules', 'lets')), 'node_modules', 'lets'));
  }
  catch (e) {
    throw new Error(exports.letsError);
  }

  try {
    exports.letsfile = require(path.join(findup.sync(cwd, 'Letsfile.js'), 'Letsfile'));
  }
  catch (e) {
    throw new Error(exports.letsfileError);
  }

  exports.lets.runTasks(exports.lets.load(exports.letsfile), argv._[0], argv._[1], exports.done);
};

exports.done = function (err) {
  //## Create a logging utility, and use process.stdout instead of console
  if(err) {
    console.error(err);
  }
  else {
    console.log('Status OK');
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
