"use strict";

const port = 8080,
    Log = require('log'),
    log = new Log( "debug" ),
    express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    fs = require('fs'),
    io = require('socket.io')(server),
    path = require('path');



const gameEngine = require("./gameEngine.js");
// Chargement de socket.io


app.use(express.static(path.join(__dirname, '/public')))
    .get('/', function(req, res){
        fs.readFile('./index.html', 'utf-8', function(error, content) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content);
        });
    })
    .get('/test', function(req, res){
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.write("test");
        res.end();
    });

io.on('connection', function (socket) {
    log.info('new user connected');
    socket.on('click', function (from, msg) {
        log.info(from + ' clicked ' + msg);
    });
});



server.listen(port, function () {
    log.info('listening on port ' + port);
});
