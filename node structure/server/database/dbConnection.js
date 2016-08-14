'use strict';
var mongodb = require('mongodb');
var q = require('q');
var MongoClient = mongodb.MongoClient;
var config = require('config');
var dbConfig = config.get('dbConfig');

var url = 'mongodb://' + dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.dbName;
module.exports = {
  getConnection: function () {
    var self = this;
    self.deferred = q.defer();
    MongoClient.connect(url, function (err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
        self.deferred.reject(err);
      } else {
        self.deferred.resolve(db);
      }
    });
    return self.deferred.promise;
  }
}