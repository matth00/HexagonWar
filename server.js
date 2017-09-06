"use strict";

const port = 8080,
    Log = require('log'),
    log = new Log( "debug" ),
    express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    fs = require('fs'),
    io = require('socket.io')(server),
    path = require('path'),
    session = require('express-session');



const gameEngine = require("./gameEngine.js");
let battlefield = gameEngine.Battlefield(10,10);
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
    log.info('new user connected with id ');
    socket.on('click', function (from, msg) {
        log.info(from + ' clicked ' + msg);
    });
    socket.on('NewPlayer', function (playerName) {
        battlefield.newPlayer(playerName, socket.id,
            function () {
                log.info(playerName + ' joined the game on socket id: ' + socket.id);
                socket.emit('PlayerJoin','Welcome');
                socket.emit('NewBattlefield', JSON.stringify(battlefield));
            },
            function (errorCode) {

                if (errorCode == 1){
                    log.info(playerName+ ' already used');
                    socket.emit('PlayerJoin','ServerFull');
                }
                if (errorCode == 2){
                    log.info(playerName+ ' already used');
                    socket.emit('PlayerJoin','AlreadyUsed');
                }

            });
    });
    socket.on('BuyCell', function (JSONCell){
        let cell = JSON.parse(JSONCell);
        let idPlayer = battlefield.getIdPlayerFromSocket(socket.id);
        battlefield.buyCell(idPlayer, cell.x, cell.y);
        socket.emit('NewBattlefield', JSON.stringify(battlefield));
    });
});



server.listen(port, function () {
    log.info('listening on port ' + port);
});
