'use strict';

//## Check for --quiet or --debug flags and proxy accordingly
module.exports.log = process.stdout.write.bind(process.stdout);
module.exports.error = process.stdout.write.bind(process.stdout);
