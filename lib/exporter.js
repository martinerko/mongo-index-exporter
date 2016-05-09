/*!
 * mongo-index-exporter
 * Copyright(c) 2016 martinerko <martinerko@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var debug = require('debug')('mongo-index-exporter:exporter');
var MongoClient = require('mongodb').MongoClient;
var Promise = require('bluebird');

/**
 * Returns list of collections in given database
 *
 * @param  {Object} db  connected database
 * @return {Array}      list of collections
 */
function getCollectionNames(db) {
  return db.listCollections()
    .toArray()
    .map(function(c) {
      return c.name;
    });
}

/**
 * Collects indexes for specific collection
 *
 * @param  {Object} db              connected database
 * @param  {String} collectionName  collection name
 * @return {Array}                  list of index definitions
 * @api private
 */

function getIndexes(db, collectionName) {
  return db.collection(collectionName)
    .listIndexes()
    .toArray();
}

/**
 * Collects indexes for received list of collections
 *
 * @param  {Object} db              connected database
 * @param  {Array} collectionNames  list of collections
 * @return {String}                 mongodb connection string
 * @api private
 */

function collectAllIndexes(db, collectionNames) {
  debug('collecting db indexes');
  return Promise.props(
    collectionNames.sort().reduce(function(map, collectionName) {
      map[collectionName] = getIndexes(db, collectionName);
      return map;
    }, {})
  );
}

/**
 * Converts received connection object into connection string
 *
 * @param  {Object} args  database connection parameter
 * @return {String}       mongodb connection string
 * @api private
 */

function getConnectionString(args) {
  var conn = args.connectionString;
  if (args.username) {
    if (args.password) {
      debug('authentication with username and password');
      conn = args.username + ':' + args.password + '@' + conn;
    } else {
      debug('password not specified, skipping authentication');
    }
  }
  return 'mongodb://' + conn;
}

/**
 * Exports index definitions for each collection in given database
 *
 * @param  {Object} args        database connection parameters
 * @param  {Function} callback  callback to be executed once we dump all indexes
 * @api public
 */

function exporter(args, callback) {
  debug('exporting db indexes');
  var connectionString = getConnectionString(args);

  MongoClient.connect(connectionString, {
    promiseLibrary: Promise
  })
    .then(function(db) {
      getCollectionNames(db)
        .then(collectAllIndexes.bind(null, db))
        .then(callback.bind(null, null))
        .catch(callback)
        .finally(db.close.bind(db));
    })
    .catch(callback);
}

module.exports = exporter;
