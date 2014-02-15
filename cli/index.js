'use strict';

var fs = require('fs'),
    path = require('path');


// Simple exporting of all sibling files
fs.readdirSync(__dirname).filter(function (file) {
  return file !== path.basename(__filename) && (path.extname(file) === '.js' ||
    fs.statSync(path.join(__dirname, file)).isDirectory());
}).map(function (file) {
  return path.basename(file, path.extname(file));
}).forEach(function (file) {
  exports[file] = require('./' + file);
});
