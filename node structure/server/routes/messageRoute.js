'use strict';

var express = require('express');
var messageService = require('../services/messageService');
var router = express.Router();
var config = require('config');

router.get('/', function(req, res, next) {
    messageService.getMessages()
        .then(function(result) {
            res.send(result);
        })
        .catch(function(err) {
            res.send(err);
        });
});

router.get('/add', function(req, res, next) {
    var obj = {
        name: req.query.name,
        content: req.query.content
    }
    messageService.addMessage(obj)
    .then(function(result) {
            res.send(result);
        })
        .catch(function(err) {
            res.send(err);
        });

});

module.exports = router;