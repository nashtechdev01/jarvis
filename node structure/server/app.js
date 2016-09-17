var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var messageRoutes = require('./routes/messageRoute');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Allow cross domain.
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Cache-Control')
    next();
});

app.use(express.static(path.join(__dirname + '/../client')));
app.use('/api/messages/', messageRoutes);

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.json({ "error": err.message });
});

io.on('connection', function (socket) {
    this.pushNotificationInterval = setInterval(function(){
      console.log('push notification');
      socket.emit('push-notification', '<a href="http://www.w3schools.com/html/">Visit our <b>HTML</b> tutorial</a>');
    }, 2000);
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
        clearInterval(this.pushNotificationInterval);
    });
    socket.on('chat message', function (msg) {
        socket.broadcast.emit('chat message', msg);
    });

});

http.listen(3000, function () {
    console.log('port: ' + 3000);
});
