"use strict";

const port = 8080;
const Log = require("log");
const log = new Log( "debug" );
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const fs = require("fs");
const io = require("socket.io")(server);
const path = require("path");
const session = require("express-session");
const TIMERINTERVAL = 5;//time in seconds



const gameEngine = require("./gameEngine.js");
let battlefield = gameEngine.Battlefield(30,30);
// Chargement de socket.io


app.use(express.static(path.join(__dirname, "/public")))
    .get("/", function(req, res){
        fs.readFile("./index.html", "utf-8", function(error, content) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content);
        });
    })
    .get("/test", function(req, res){
        res.writeHead(200, {"Content-Type":"text/plain"});
        res.write("test");
        res.end();
    });

io.on("connection", function (socket) {
    log.info("new user connected with socket id " + socket.id);
    socket.on("disconnect", function () {
        let idPlayer = battlefield.getIdPlayerFromSocket(socket.id);
        if (idPlayer !== undefined){
            let playerName = battlefield.getPlayers()[idPlayer].getName();
            battlefield.playerQuit(idPlayer);
            log.info(playerName+" left the game");
        }
    });
    socket.on("NewPlayer", function (playerName) {
        battlefield.newPlayer(playerName, socket.id,
            function () {
                socket.emit("PlayerJoin","Welcome");
                io.sockets.emit("NewBattlefield", JSON.stringify(battlefield));
                log.info(playerName + " joined the game on socket id: " + socket.id);
            },
            function (errorCode) {

                if (errorCode === 1){
                    log.info(playerName+ " tried to join the game but the room is full");
                    socket.emit("PlayerJoin","ServerFull");
                }
                if (errorCode === 2){
                    log.info(playerName+ " already used");
                    socket.emit("PlayerJoin","AlreadyUsed");
                }

            });
    });
    socket.on("BuyCell", function (JSONCell){
        let cell = JSON.parse(JSONCell);
        let idPlayer = battlefield.getIdPlayerFromSocket(socket.id);
        if (idPlayer === undefined){
            return undefined;
        }
        battlefield.buyCell(idPlayer, cell.x, cell.y,
            function () {//success
                log.info(battlefield.getPlayers()[idPlayer].getName() +" bought cell ("+ cell.x+":"+ cell.y+")");
                io.sockets.emit("NewBattlefield", JSON.stringify(battlefield));
            },
            function (errorcode) {//failed
                if (errorcode === 1){
                    log.info(battlefield.getPlayers()[idPlayer].getName() +" tried to buy cell ("+ cell.x+":"+ cell.y+") with errcode 1");
                    socket.emit("BuyCellError","NotEnoughMoney");
                }
                if (errorcode === 2){
                    log.info(battlefield.getPlayers()[idPlayer].getName() +" tried to buy cell ("+ cell.x+":"+ cell.y+") with errcode 2");
                    socket.emit("BuyCellError","NotANeighboor");
                }
            });
    });
});

setInterval(function () {
    battlefield.creditPlayers();
    io.sockets.emit("PointsUpdate", JSON.stringify(battlefield.getPlayers()));
    log.info("points updated");
}, TIMERINTERVAL*1000);



server.listen(port, function () {
    log.info("listening on port " + port);
});
