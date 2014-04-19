'use strict';

var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    logger = require('./logger');


module.exports = function (args) {
  var argv = require('./argv'),
      basepath, filename, filepath, template, text,
      config, stages = [], tasks = [];

  basepath = path.join(__dirname, '..', 'doc');
  filename = ['help'].concat(args.slice(0), 'ejs').join('.');
  filepath = path.join(basepath, filename);
  template = fs.readFileSync(filepath).toString();

  try {
    argv.requireLocalLets();
    argv.requireLetsfile();
    config = argv.loadLetsfile();
    stages = Object.keys(config._stages);
  }
  catch (e) {}

  text = _.template(template, {
    pkg: require('../package'),
    stages: stages,
    tasks: tasks
  });

  logger.plain(text);
};
