'use strict';

var pkg = require('../package');

exports.isCaptured = false;


exports.log = function (message) {
  process.stdout.write(message);
  process.stdout.write('\n');
};

exports.error = function (message) {
  process.stderr.write(pkg.name + ': ');
  process.stderr.write(message);
  process.stderr.write('\n');
};


exports.capture = function capture (lets, argv) {
  var isVerbose = argv.verbose || argv.V,
      isQuiet = argv.quiet || argv.q || argv.silent;

  if(!exports.isCaptured) {
    if(isVerbose) {
      lets.logger.on('debug', exports.log);
    }

    if(!isQuiet || isVerbose) {
      lets.logger.on('info', exports.log);
    }

    lets.logger.on('warn', exports.error);
    lets.logger.on('error', exports.error);

    // Warn if someone sets both conflicting flags
    if(isVerbose && isQuiet) {
      process.error('Warning: the --quiet flag was overridden by --verbose.');
    }

    // Prevent adding multiple eventlisteners when instanciated more than once
    exports.isCaptured = true;
  }
};
