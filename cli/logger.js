'use strict';

var log = require('npmlog');
var pkg = require('../package');

exports.isCaptured = false;


/* Setup npmlog
============================================================================= */

log.heading = 'lets';

log.addLevel('debug', 1000, {
  fg: 'blue',
  bg: 'black'
});

// Output everything, handle log levels internally (for now at least)
log.level = -Infinity;

// Overwrite default prefixes, ensure same length
log.disp.debug =  'debug';
log.disp.info =   'info ';
log.disp.warn =   'warn ';
log.disp.err =  'ERROR';


/* Public methods
============================================================================= */

exports.log = function (level) {
  if(log[level]) {
    // If there's only two arguments set it means no prefix has been used. Set
    // the prefix to ''
    if(arguments.length <= 2) {
      [].splice.call(arguments, 1, 0, '');
    }

    log.log.apply(log, arguments);
  }
  else {
    log.warn(pkg.name, 'Log level ' + level + ' does not exist');
  }
};

// Kept to not have to rewrite test and in the future might decide to separate
// stdlog and stderr output, even though npmlog discourages it.
exports.error = exports.log;


// Log plain messages, for testability
exports.plain = function () {
  console.log.apply(console, arguments);
};


exports.capture = function capture (lets, argv) {
  var isVerbose = argv.verbose || argv.V,
      isQuiet = argv.quiet || argv.q || argv.silent;

  if(!exports.isCaptured) {
    if(isVerbose) {
      lets.logger.on('debug', exports.log.bind(exports, 'debug'));
    }

    if(!isQuiet || isVerbose) {
      lets.logger.on('info', exports.log.bind(exports, 'info'));
    }

    lets.logger.on('warn', exports.error.bind(exports, 'warn'));
    lets.logger.on('err', exports.error.bind(exports, 'err'));

    // Warn if someone sets both conflicting flags
    if(isVerbose && isQuiet) {
      exports.error(pkg.name,
        'Warning: the --quiet flag was overridden by --verbose.');
    }

    // Prevent adding multiple eventlisteners when instanciated more than once
    exports.isCaptured = true;
  }
};
