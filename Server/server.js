"use strict";

const Log = require('log');
const log = new Log( "debug" );
const express = require("express");
const app = express();
const fs = require('fs');
let battlefield = require("./gameEngine.js");

app.get('/', function(req, res){
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
})
    .use(function(req, res, next){

    });


let server = require("http").createServer(app).listen(80);
