'use strict';
var q = require('q');
var dbCon = require('../database/dbConnection');
var TextMiner = require('../helper/textminer');

module.exports = {
    getMessages: function (msg) {
        var self = this;
        self.deferred = q.defer();
        var connection = null;
        dbCon.getConnection()
            .then(function (db) {
                // 0. Analyze words.
                // var words = this.analyzeWord(msg);
                // 1. Query in db
                connection = db;
                var collection = db.collection('messages');

                var messages = collection.find({}, {name: true, content: true});

                // Variable messages return object event if nothing exist in db so I trick it here to pass to google crawler.
                messages = null;

                if (messages) {
                    self.deferred.resolve(messages.toArray());
                    return;
                }

                // 2. Call crawler services
                var GoogleSearchClass = require('./googlesearch');
                var googleSearch = new GoogleSearchClass();
                googleSearch.crawGoogleSearch(msg, function(res){
                    self.deferred.resolve(self.googleResultToHtml(res.items[0]));
                });
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
    },

    insertUpdateData: function (key, collectionName) {  // obj {name, content}
        var self = this;
        self.deferred = q.defer();
        var connection = null;
        dbCon.getConnection()
            .then(function (db) {
                connection = db;
                var collection = db.collection(collectionName);

                collection.update({_id: key}, {
                    $inc: {count: 1},
                    $set: {_id: key}
                }, {upsert: true}, function () {
                    self.deferred.resolve();
                })

                /*collection.insert([obj], function (err, result) {
                 if (err) {
                 self.deferred.reject(err);
                 } else {
                 self.deferred.resolve(result);
                 }
                 })*/
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

    insertUpdateDataArray: function (words, collectionName) {  // obj {name, content}

        var self = this;
        self.deferred = q.defer();
        var connection = null;
        dbCon.getConnection()
            .then(function (db) {
                connection = db;
                var collection = db.collection(collectionName);
                var arrayLength = words.length;

                for (var i = 0; i < arrayLength; i++) {
                    var id = words[i].toLowerCase();
                    collection.update({_id: id}, {
                        $inc: {count: 1},
                        $set: {_id: id}
                    }, {upsert: true}, function () {
                        self.deferred.resolve();
                    })
                }
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
    analyzeWord: function () {
        var textMiner = new TextMiner([msg]);

        return {
            vocabulary: textMiner.terms.vocabulary,
            dtm: textMiner.terms.dtm,
        };
    },
    // Convert result got from google to html.
    googleResultToHtml: function (result) {
        var html = '';
        // Get Title;
        html += '<a href="'+ result.link + '">' + result.title + '</a>';
        return html;
    }
};