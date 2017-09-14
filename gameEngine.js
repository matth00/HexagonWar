"use strict";

function Player(n, c, s) {
    const DEFAULTPOINTS = 10;
    let name = n;
    let color = c;
    let nbCellsOwned = 1;
    let points = DEFAULTPOINTS;
    let seedX = undefined;
    let seedY = undefined;
    let socket = s;


    return{
        getName: function () {
            return name;
        },
        setName: function(newName){
            name = newName;
        },
        getColor: function () {
            return color;
        },
        setColor: function(newColor){
            color = newColor;
        },
        getNbCellsOwned: function () {
            return nbCellsOwned;
        },
        incrCellsOwned: function () {
            nbCellsOwned+=1;
        },
        decrCellsOwned: function () {
            nbCellsOwned-=1;
        },
        getPoints: function () {
            return points;
        },
        incrPointsN: function (n) {
            points+=n;
        },
        decrPointsN: function (n) {
            points-=n;
        },
        setSeed: function(x,y){
            seedX = x;
            seedY = y;
        },
        getSeed: function(){
            let x = seedX;
            let y = seedY;
            return{
                x, y
            };
        },
        getIdSocket: function(){
            return socket;
        },
        setIdSocket: function(idSocket){
            socket = idSocket;
        },
        toJSON: function(){
            let pts = Math.floor(points);
            return {name,color,nbCellsOwned,points:pts};
        }
    };
}

function Cell(c) {
    let idOwner = undefined;
    let cost = c;
    const PRICEFREECELL = 3;
    const PRICEOWNEDCELL = 10;
    return{
        setIdOwner: function (id) {
            idOwner = id;
        },
        getIdOwner: function () {
            return idOwner;
        },
        setCost: function (c) {
            cost = c;
        },
        getCost: function () {
            return cost;
        },
        isOwned(){
            return idOwner !== undefined;
        },
        takeCell: function (idPlayer) {
            idOwner = idPlayer;
            cost = PRICEOWNEDCELL;
        },
        releaseCell: function () {
            idOwner = undefined;
            cost = PRICEFREECELL;
        },
        toJSON: function(){
            return {idOwner,cost};
        }
    };
}

function Battlefield(w, h) {
    const width = w;
    const height = h;
    const DEFAULTCELLCOST = 3;
    const POINTSINCREMENTS = 0.2;
    let players = [];
    let battlefield = [];
    let nbPlayers = 0;
    const colors = [
        {used: false, value: "#0772a1"},
        {used: false, value: "#ff3100"},
        {used: false, value: "#ff8700"},
        {used: false, value: "#00b741"},
        {used: false, value: "#9702a7"},
        {used: false, value: "#01939a"},
        {used: false, value: "#cd0074"}
    ];
    const MAXNBPLAYERS = colors.length;

    function selectColor(){
        let color = undefined;
        colors.some(function (c) {
            color = c;
            return !color.used;
        });
        color.used = true;
        return color.value;
    }

    function init() {
        let i = 0;
        let j = 0;
        while(i < height){
            battlefield[i] = [];
            while(j<width){
                battlefield[i][j] = Cell(DEFAULTCELLCOST);
                j = j+1;
            }
            j=0;
            i=i+1;
        }
        i=0;
        while (i<MAXNBPLAYERS){
            players[i] = null;
            i+=1;
        }
    }

    init();

    function addPlayer(name,color, idSocket) {
        let p = Player(name, color, idSocket);
        let i=0;
        while (players[i] !== null){
            console.log(i);
            i+=1;
        }
        players[i] = p;
        nbPlayers+=1;
        return i;
        // return players.push(p)-1;
    }

    function removePlayer(idPlayer) {
        players[idPlayer] = null;
        nbPlayers-=1;
    }

    function getNeighboors(x, y) {
        let neighboors = [
            [{x:0, y:1}, {x:-1, y:0}, {x:-1, y:-1}, {x:0, y:-1}, {x:1, y:-1}, {x:1, y:0}],
            [{x:0, y:1}, {x:-1, y:1}, {x:-1, y:0}, {x:0, y:-1}, {x:1, y:0}, {x:1, y:1}]];
        let shift = x % 2;
        let newNeighboors = [];

        neighboors[shift].forEach(function(neighboor) {
            neighboor.x = x+neighboor.x;
            neighboor.y = y+neighboor.y;
            if (neighboor.x >= 0 && neighboor.x < height && neighboor.y >= 0 && neighboor.y < width) {
                newNeighboors.push(neighboor);
            }
        });
        return newNeighboors;
    }

    function isPlayerNameFree(name){
        if (nbPlayers === 0){
            return true;
        }
        let flag = true;
        players.forEach(function (player) {
            if (player !== null) {
                if (player.getName() === name) {
                    flag = false;
                }
            }
        });
        return flag;
    }

    function canPlayerBuyCell(idPlayer, x,y) {
        let idOwner = undefined;
        let neighboors = getNeighboors(x,y);
        if (battlefield[x][y].getIdOwner() === idPlayer){
            return false;
        }
        neighboors.some(function (cell) {
            if (cell === undefined){
                return false;
            }
            idOwner = battlefield[cell.x][cell.y].getIdOwner();
            return idPlayer === battlefield[cell.x][cell.y].getIdOwner();
        });
        return idOwner === idPlayer;
    }

    return {
        getPlayers: function () {
            return players;
        },
        getIdPlayerFromSocket: function (idSocket) {
            let id = undefined;
            players.some(function (player, index) {
                if (player === null){
                    id = undefined;
                    return false;
                }
                id = index;
                return player.getIdSocket() === idSocket;
            });
            return id;
        },
        getBattlefield: function () {
            return battlefield;
        },
        initialize: init,
        newPlayer: function (name, socketId, success, fail) {
            if (nbPlayers === MAXNBPLAYERS){
                fail(1);
                return undefined;
            }
            if (!isPlayerNameFree(name)) {
                fail(2);
                return undefined;
            }
            let color = selectColor();
            let idPlayer = addPlayer(name, color, socketId);
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * height);
            players[idPlayer].setSeed(x,y);
            let neighboors = getNeighboors(x,y);
            battlefield[x][y].takeCell(idPlayer);
            neighboors.forEach(function (cell) {
                battlefield[cell.x][cell.y].takeCell(idPlayer);
                players[idPlayer].incrCellsOwned();

            });
            success();
        },
        buyCell: function (idPlayer, x, y, success, fail) {
            if (players[idPlayer].getPoints() < battlefield[x][y].getCost()) {
                fail(1);
                return undefined;
            }
            if (!canPlayerBuyCell(idPlayer,x,y)){
                fail(2);
                return undefined;
            }
            players[idPlayer].decrPointsN(battlefield[x][y].getCost());
            players[idPlayer].incrCellsOwned();
            battlefield[x][y].takeCell(idPlayer);
            success();
        },
        creditPlayers: function () {
            players.forEach(function (player, index) {
                if (player !== null){
                    player.incrPointsN(player.getNbCellsOwned() * POINTSINCREMENTS);
                }
            });
        },
        playerQuit: function (idPlayer) {
            battlefield.forEach(function (cells){
                cells.forEach(function(cell){
                    if (cell.getIdOwner() === idPlayer){
                        cell.releaseCell();
                    }
                });
            });
            removePlayer(idPlayer);
        },
        toJSON: function(){
            return {players,battlefield};
        }
    };
}

exports.Battlefield = (width, height) => Battlefield(width, height);