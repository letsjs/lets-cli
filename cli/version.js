'use strict';

var logger = require('./logger'),
    pkg = require('../package');

module.exports = function (cwd) {
  var argv = require('./argv');

  logger.log(pkg.name + ' v' + pkg.version + '\n');

  // Ignore local lets here if it doesn't exist.
  try {
    argv.requireLocalLets(cwd);
    logger.log(argv.lets.pkg.name + ' v' + argv.lets.pkg.version + '\n');
  }
  catch (e) {}
};
