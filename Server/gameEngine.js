"use strict";

function Player(n, c) {
    const DEFAULTPOINTS = 10;
    let name = n;
    let color = c;
    let nbCellsOwned = 1;
    let points = DEFAULTPOINTS;
    let seedX = undefined;
    let seedY = undefined;

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
        setSeed(x,y){
            seedX = x;
            seedY = y;
        },
        getSeed(){
            let x = seedX;
            let y = seedY;
            return{
                x, y
            }
        }
    }
}

function Cell(c) {
    let owner = undefined;
    let cost = c;
    return{
        setOwner: function (idOwner) {
            owner = idOwner;
        },
        getOwner: function () {
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
        }
    }
}

function Battlefield(width, heigth) {
    const DEFAULTCELLCOST = 3;
    let players = [];
    let battlefield = [];

    function init() {
        let i = 0;
        let j = 0;
        while(i < heigth){
            battlefield[i] = [];
            while(j<width){
                battlefield[i][j] = Cell(DEFAULTCELLCOST);
                j++;
            }
            j=0;
            i++;
        }

    }

    function addPlayer(name) {
        let p = Player(name);
        return players.push(p) - 1;
    }

    function getNeighboors(x, y) {
        return [battlefield[x][y]];
    }

    return {
        getPlayers: function () {
            return players;
        },
        getBattlefield: function () {
            return battlefield;
        },
        initialize: init,
        newPlayer: function (name) {
            let idPlayer = addPlayer(name);
            let x = Math.floor(Math.random() * width);
            let y = Math.floor(Math.random() * heigth);
            players[idPlayer].setSeed
            let neighboors = getNeighboors(x,y);
            neighboors.forEach(function (cell) {
                cell.setOwner(idPlayer);
            })
        },
        buyCell: function (idPlayer, x, y) {
            const priceOwnedCell = 10;
            if (players[idPlayer].getPoints() > battlefield[x][y].getCost()) {
                players[idPlayer].decrPointsM(priceOwnedCell);
                players[idPlayer].incrCellsOwned();
                battlefield[x][y].setOwner(idPlayer);
                battlefield[x][y].setCost(priceOwnedCell);
            }
        },
        releaseCell: function (x,y) {
            battlefield[x][y].setOwner(undefined);
        }
    }
}

exports.Battlefield = Battlefield;