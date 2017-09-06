"use strict";

function Player(n, c, s) {
    const DEFAULTPOINTS = 3000;
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
            nbCellsOwned++;
        },
        decrCellsOwned: function () {
            nbCellsOwned--;
        },
        getPoints: function () {
            return points;
        },
        incrPointsN: function (n) {
            points+=n;
        },
        decrPointsM: function (n) {
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
            }
        },
        getIdSocket: function(){
            return socket;
        },
        setIdSocket: function(idSocket){
            socket = idSocket;
        },
        toJSON: function(){
            return {name,color,nbCellsOwned, points};
        }
    }
}

function Cell(c) {
    let idOwner = undefined;
    let cost = c;
    return{
        setIdOwner: function (id) {
            idOwner = id;
        },
        getIdOwner: function () {
            return owner;
        },
        setCost: function (c) {
            cost = c;
        },
        getCost: function () {
            return cost;
        },
        isOwned(){
            return owner !== undefined;
        },
        takeCell: function (idPlayer) {
            const PRICEOWNEDCELL = 10;

            idOwner = idPlayer;
            cost = PRICEOWNEDCELL;
        },
        releaseCell: function () {
            const PRICEFREECELL = 3;

            idOwner = undefined;
            cost = PRICEFREECELL;
        },
        toJSON: function(){
            return {idOwner,cost};
        }
    }
}

function Battlefield(w, h) {
    const width = w,
        height = h,
        DEFAULTCELLCOST = 3;
    let players = [];
    let battlefield = [];
    const colors = [
        {used: false, value: '#0772a1'},
        {used: false, value: '#ff3100'},
        {used: false, value: '#ff8700'},
        {used: false, value: '#00b741'},
        {used: false, value: '#9702a7'},
        {used: false, value: '#01939a'},
        {used: false, value: '#cd0074'}
    ];
    const MAXNBPLAYERS = colors.length;
    init();

    function selectColor(){
        let color = undefined;
        colors.some(function (c) {
            color = c;
            return !color.used;
        })
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

    }

    function addPlayer(name,color, idSocket) {
        let p = Player(name, color, idSocket);
        return players.push(p) - 1;
    }

    function getNeighboors(x, y) {
        let neighboors = [
            [{x:0, y:1}, {x:-1, y:0}, {x:-1, y:-1}, {x:0, y:-1}, {x:1, y:-1}, {x:1, y:0}],
            [{x:0, y:1}, {x:-1, y:1}, {x:-1, y:0}, {x:0, y:-1}, {x:1, y:0}, {x:1, y:1}]];
        let shift = x % 2;
        let newNeighboors = [];

        neighboors[shift].forEach(function(neighboor) {
            neighboor.x = x+neighboor.x
            neighboor.y = y+neighboor.y;
            if (neighboor.x >= 0 && neighboor.x < height && neighboor.y >= 0 && neighboor.y < width) {
                newNeighboors.push(neighboor);
            }
        });
        return newNeighboors;
    }

    function isPlayerNameFree(name){
        if (players.length === 0){
            return true;
        }
        let p = undefined;
        players.some(function (player) {
            p = player;
            return player.getName() === name;
        });
        return !(p.getName() === name);
    }

    function canPlayerBuyCell(idPlayer, x,y) {
        let idOwner = undefined;
        getNeighboors(x,y).some(function (cell) {
            idOwner = cell.getIdOwner();
            return idPlayer === cell.getIdOwner();
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
            if (players.length === MAXNBPLAYERS){
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
            });
            success();
        },
        buyCell: function (idPlayer, x, y, success, fail) {


            if (players[idPlayer].getPoints() >= battlefield[x][y].getCost()) {
                players[idPlayer].decrPointsM(battlefield[x][y].getCost());
                players[idPlayer].incrCellsOwned();
                battlefield[x][y].takeCell(idPlayer);
            }
        },
        releaseCell: function (x,y) {
            battlefield[x][y].setOwner(undefined);
        },
        toJSON: function(){
            return {players,battlefield};
        }
    }
}

exports.Battlefield = (width, height) => Battlefield(width, height);