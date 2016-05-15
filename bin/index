#!/usr/bin/env node

/*!
 * mongo-index-exporter
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var argv = require('minimist')(process.argv.slice(2));
var help = require('./help');
var exporter = require("../lib/exporter");

if (argv.h || argv.help) {
  help();
  process.exit(0);
}

var connArgs = {
  connectionString: process.argv[2],
  username: argv.username,
  password: argv.password
};

function processOutput(dbCollectionsIndexes) {
  Object.keys(dbCollectionsIndexes).forEach(function(col) {
    var indexes = dbCollectionsIndexes[col];
    if (indexes.length) {
      console.log('// %s', col);
      indexes.map(getCreateIndexStatement.bind(null, col)).sort().forEach(function(def) {
        console.log(def);
      });
      console.log('');
    }
  });
}

function getCreateIndexStatement(col, indObj) {
  var keys = JSON.stringify(indObj.key);
  delete indObj.v;
  delete indObj.key;
  delete indObj.ns;
  var options = JSON.stringify(indObj);

  return 'db.' + col + '.createIndex(' + keys + ', ' + options + ');';
}

exporter(connArgs, function(err, dbCollectionsIndexes) {
  if (err) {
    console.log('%s: %s', err.name, err.message);
    process.exit(1);
  } else {
    processOutput(dbCollectionsIndexes);
  }
});
