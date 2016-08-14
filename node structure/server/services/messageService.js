'use strict';
var q = require('q');
var dbCon = require('../database/dbConnection');
module.exports = {
    getMessages: function () {
        var self = this;
        self.deferred = q.defer();
        var connection = null;
        dbCon.getConnection()
            .then(function (db) {
                connection = db;
                var collection = db.collection('messages');
                var messages = collection.find({}, { name: true, content: true });
                self.deferred.resolve(messages.toArray());
            })
            .catch(function (err) {
                self.deferred.reject(err);
            })
            .finally(function () {
                if (connection)
                    connection.close();
            });
        return self.deferred.promise;
    },
    addMessage: function (obj) {  // obj {name, content}
        var self = this;
        self.deferred = q.defer();
        var connection = null;
        dbCon.getConnection()
            .then(function (db) {
                connection = db;
                var collection = db.collection('messages');
                collection.insert([obj], function (err, result) {
                    if (err) {
                        self.deferred.reject(err);
                    } else {
                        self.deferred.resolve(result);
                    }
                })
            })
            .catch(function (err) {
                self.deferred.reject(err);
            })
            .finally(function () {
                if (connection)
                    connection.close();
            });
        return self.deferred.promise;
    }
}