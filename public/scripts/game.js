/**
* Game
*/

"use strict";

function Game() {
  // Settings
  let setting_server_ip = "127.0.0.1:8080";
  let setting_hexagon_size = 30;
  let setting_map_width = 50;
  let setting_map_height = 50;
  let setting_canvas_padding = 60; // Space between border and grid
  let setting_border_size = 6;
  let setting_interval_time = 20;
  let setting_moving_zone_size = 40; // Zone wid
  // End settings

  let player_name = undefined;
  let player_id = undefined;

  let players = undefined; // Array of players (an element can be undefined)

  // Sockets
  let name_verified_by_server = false;


  let socket = io.connect(setting_server_ip);


  // Flags
  let need_resize = false;
  let map_initialized = false;
  let game_initalized = false;

  // Components
  let display;
  let map;
  let hexagon;
  let input;
  let timer;

  /**
  * Show the settings
  */
  function showSettings() {
    document.getElementById("settings").style.display = "block";
    document.getElementById("display").style.display = "none";
  }

  /**
  * Show the Playground (& score)
  */
  function showPlayground() {
    document.getElementById("settings").style.display = "none";
    document.getElementById("display").style.display = "block";
  }

  function showErrorMessage(pTitle,pMessage) {
    document.getElementById("messages").innerHTML="<div class=\"alert alert-danger alert-dismissable\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>"+pTitle+"</strong>  "+pMessage+"</div>";
  }

  /**
  * Init the game
  */
  function init() {


    // Init input
    input = Input();

    // Init hexagon
    hexagon = Hexagon(setting_hexagon_size, Point(0,0));
    map = Map();
    map.createEmptyMap(setting_map_width,setting_map_height, hexagon, setting_canvas_padding);

    // Init playground
    // Compute the size of the playground
    let playground_width = 2*setting_canvas_padding+setting_map_width*hexagon.getWidth();
    let playground_height = 2*setting_canvas_padding+setting_map_height*hexagon.getHeight();

    // Init display
    display = Display();
    display.init(playground_width,playground_height,setting_border_size);
    display.setHexagon(hexagon);
    display.resize();

    //Init timer
    timer = setInterval(frame, setting_interval_time);

    game_initalized = true;
  }

  /**
  * Server message : PlayerJoin
  * Welcome => OK
  * AlredyUsed => Name used
  * ServerFull
  */
  socket.on("PlayerJoin", function(message) {
    console.log(message);
    if (message === "Welcome") {
      console.log("PlayerJoin : Welcome");
      name_verified_by_server = true;
    } else if (message === "AlreadyUsed") {
      console.log("PlayerJoin : Name alredy used");
      name_verified_by_server = false;
      showErrorMessage("Error.","Your name is alredy used by another player.");
    } else if (message === "ServerFull"){
      console.log("PlayerJoin : Server full");
      name_verified_by_server = false;
      showErrorMessage("Error.","The server is full");
    }
  });

  socket.on("PointsUpdate", function(points) {
    let data = JSON.parse(points);
    players = data;
  });

  /**
  * Server message : NewBattlefield
  */
  socket.on("NewBattlefield", function(battlefield) {
    //console.log("battlefied")
    let data = JSON.parse(battlefield);
  //  console.log(data);

    if (!name_verified_by_server) {
      return;
    }

    // The first time we receive the map
    if (!map_initialized) {
      setting_map_height = data.battlefield.length;
      setting_map_width = data.battlefield[0].length;

      init();
      map_initialized = true;

      players = data.players; // name, color, nbCellsOwned, points
      players.forEach(function(player, index) {
        if (player === undefined || player === null) {
          return;
        }
        if (player.name === player_name) {
          player_id = index;
        }
      });
      showPlayground();

    }


      players = data.players;

      data.battlefield.forEach(function(row,rowIndex) {
        row.forEach(function(cell,columnIndex) {

          map.getCase(rowIndex,columnIndex).setCost(cell.cost);

          if (cell.idOwner !== player_id) {
              map.getCase(rowIndex, columnIndex).setText(cell.cost);
            } else {
                map.getCase(rowIndex, columnIndex).setText(undefined);
            }

          if (cell.idOwner !== undefined) {
            map.getCase(rowIndex, columnIndex).setOwner(cell.idOwner);
            map.getCase(rowIndex, columnIndex).setColor(players[cell.idOwner].color);

          } else {
              map.getCase(rowIndex,columnIndex).setOwner(undefined);
                map.getCase(rowIndex, columnIndex).setColor("white");
              //map.getCase(rowIndex,columnIndex).setText(undefined);
          }
        });
      });
  });

  /**
  * Draw hexagons
  */
  function drawHexagons() {
    let while_height = 0;
    let while_width = 0;

    let decalage = 0;

    while(while_height < map.getHeight()) {

      while(while_width < map.getWidth()) {
        display.drawHexagon(map.getCase(while_height,while_width));
        while_width += 1;
      }
        while_height += 1;
        while_width = 0;
    }
  }

  /**
  * Convert a pixel on screen to the map offset
  */
  function pixelToOffset(pMousePosition) {
    let playground_position = display.getPlaygroundMousePosition(pMousePosition);
    playground_position.addToX(-setting_canvas_padding);
    playground_position.addToY(-setting_canvas_padding);
    return hexagon.getIndexFromPixel(playground_position);
  }

  function frame() {
    if (need_resize) {
      display.resize();
      need_resize = false;
    }

    //Draw
    display.draw();
    drawHexagons();
    display.drawScore(player_id,players,map.getTotalCases());

    //Input
    if(input.isMouseClicked()) {
      input.clearMouseClick();
      let offset = pixelToOffset(input.getMouseClickPosition());
      if (offset.getY() >= 0 && offset.getY() < setting_map_width && offset.getX() >= 0 && offset.getX() < setting_map_height) {
        // Inverse X and Y
        //console.log("Click on case ["+offset.getY()+";"+offset.getX()+"]");
        if (map.getCase(offset.getY(),offset.getX()).getCost() <= players[player_id].points) {
          //Test if neighbor

        //console.log("Player id:"+player_id);
          if(map.isOneNeighborSameOwner(offset.getY(), offset.getX(), player_id)) {
            //console.log("Send BuyCell to server");
            socket.emit("BuyCell", JSON.stringify({x: offset.getY() ,y: offset.getX()}));
          }
        }
      }

    }

    // Mouse moving
    if (input.getMousePosition().getX() < setting_moving_zone_size) {
      display.moveCameraLeft();
    }

    if (input.getMousePosition().getX() > display.getScreenWidth()-setting_moving_zone_size) {
      display.moveCameraRight();
    }

    if (input.getMousePosition().getY() < setting_moving_zone_size) {
      display.moveCameraUp();
    }

    if (input.getMousePosition().getY() > display.getScreenHeight()-setting_moving_zone_size) {
      display.moveCameraDown();
    }

    if(input.getKeyState("shift")) {
      display.speedUp();
    }
    if (input.getKeyState("w") || input.getKeyState("up")) {
      display.moveCameraUp();
    }
    if (input.getKeyState("s") || input.getKeyState("down") ) {
      display.moveCameraDown();
    }
    if (input.getKeyState("a") || input.getKeyState("left") ) {
      display.moveCameraLeft();
    }
    if (input.getKeyState("d") || input.getKeyState("right")) {
      display.moveCameraRight();
    }
  }

  function finishGame(pMessage) {
    map_initialized = false;
    game_initalized = false;
    showErrorMessage("Finish", pMessage);
  }


  /**
  *
  */
  function verifyName(pName) {
    if (pName.length >= 1 && pName.length <= 8) {
      player_name = pName;
      return true;
    } else {
      return false;
    }
  }


  return {
    init: function() {
      init();
    },
    requestResize() {
      need_resize = true;
    },
    keyDown: function(pKey) {
      if (game_initalized) {
        input.setKeyState(pKey,true);
      }
    },
    keyUp: function(pKey) {
      if (game_initalized) {
        input.setKeyState(pKey,false);
      }
    },
    setMousePosition: function(pX,pY) {
      if (game_initalized) {
        input.setMousePosition(pX,pY);
      }
    },
    setMouseClick: function() {
      if (game_initalized) {
        input.setMouseClick();
      }
    },
    setDoubleMouseClick: function() {
      if (game_initalized) {
        input.setDoubleMouseClick();
      }
    },
    joinGame: function(pName) {
      if (verifyName(pName)) {
        socket.emit("NewPlayer", pName);
      } else {
        showErrorMessage("Error.","Your name need to be between 1 and 8 characters long.");
      }
    }
  };
}

let game = undefined;

$(document).ready(function() {
  // Initialization
  game = Game();

  // Events
  document.getElementById("playground").addEventListener("click", game.setMouseClick);
  document.getElementById("playground").addEventListener("dblclick", game.setDoubleMouseClick);
  window.addEventListener("resize", game.requestResize);
  window.addEventListener("mousemove",function(event) {
    game.setMousePosition(event.clientX-150, event.clientY);
  });

  document.getElementById("play").addEventListener("click",function() {
    game.joinGame(document.getElementById("name").value);
  });
});

$(document).keydown(function(event) {
  if(event.keyCode === 16 ) {
    game.keyDown("shift");
  }
  if(event.keyCode === 87 ) {
    game.keyDown("w");
  }
  if(event.keyCode === 83 ) {
    game.keyDown("s");
  }
  if(event.keyCode === 65 ) {
    game.keyDown("a");
  }
  if(event.keyCode === 68 ) {
    game.keyDown("d");
  }

  if(event.keyCode === 38 ) {
    game.keyDown("up");
  }
  if(event.keyCode === 40 ) {
    game.keyDown("down");
  }
  if(event.keyCode === 37 ) {
    game.keyDown("left");
  }
  if(event.keyCode === 39 ) {
    game.keyDown("right");
  }

});

$(document).keyup(function(event) {
  if(event.keyCode === 16 ) {
    game.keyUp("shift");
  }
  if(event.keyCode === 87 ) {
    game.keyUp("w");
  }
  if(event.keyCode === 83 ) {
    game.keyUp("s");
  }
  if(event.keyCode === 65 ) {
    game.keyUp("a");
  }
  if(event.keyCode === 68 ) {
    game.keyUp("d");
  }
  if(event.keyCode === 38 ) {
    game.keyUp("up");
  }
  if(event.keyCode === 40 ) {
    game.keyUp("down");
  }
  if(event.keyCode === 37 ) {
    game.keyUp("left");
  }
  if(event.keyCode === 39 ) {
    game.keyUp("right");
  }
});
