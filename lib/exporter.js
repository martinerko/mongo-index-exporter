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
 * @return {Promise}
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
 * Authenticate user
 *
 * @param  {Object} args  database connection parameter
 * @return {Promise}
 * @api private
 */

function authenticateUser(db, args) {
  if (args.username && args.password) {
    debug('authentication with username and password');

    var authenticationDb = db;
    if (args.authenticationDatabase == 'admin') {
      debug('authenticating against admin database');
      // Use the admin database for the operation
      authenticationDb = db.admin();
    }
    return authenticationDb.authenticate(args.username, args.password);
  } else {
    debug('skipping authentication');
    return Promise.resolve(true);
  }
  return Promise.resolve(true);
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

  MongoClient.connect('mongodb://' + args.connectionString, {
    promiseLibrary: Promise
  })
    .then(function(db) {
      authenticateUser(db, args)
        .then(getCollectionNames.bind(null, db))
        .then(collectAllIndexes.bind(null, db))
        .then(callback.bind(null, null))
        .catch(callback)
        .finally(db.close.bind(db));
    })
    .catch(callback);
}

module.exports = exporter;
