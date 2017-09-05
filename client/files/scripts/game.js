/**
* Game
*/

"use strict";

function Game() {
  // Settings
  let setting_hexagon_size = 30;
  let setting_map_width = 50;
  let setting_map_height = 30;
  let setting_canvas_padding = 60; // Space between border and grid
  let setting_border_size = 6; // not used
  let setting_border_color = "black"; //not used
  let setting_interval_time = 20;
  let setting_moving_zone_size = 40;
  // End settings

  // Components
  let display;
  let map;
  let hexagon;
  let input;
  let timer;

  // Events flags
  let need_resize = false;

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

    //Input
    if(input.isMouseClicked()) {
      let offset = pixelToOffset(input.getMouseClickPosition());
      //console.log("Click on ["+offset.getY()+";"+offset.getX()+"]");
      if (map.getCase(offset.getY(),offset.getX()).getColor() === "white") {
        map.getCase(offset.getY(),offset.getX()).setColor("#34373d");
        //map.isOneNeighborSameOwner(offset.getY(),offset.getX());
      } else {
        map.getCase(offset.getY(),offset.getX()).setColor("white");
      }

      input.clearMouseClick();
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
  }








  return {
    init: function() {
      init();
    },
    requestResize() {
      need_resize = true;
    },
    keyDown: function(pKey) {
      input.setKeyState(pKey,true);
    },
    keyUp: function(pKey) {
      input.setKeyState(pKey,false);
    },
    setMousePosition: function(pX,pY) {
      input.setMousePosition(pX,pY);
    },
    setMouseClick: function() {
      input.setMouseClick();
    },
    setDoubleMouseClick: function() {
      input.setDoubleMouseClick();
    }
  };
}

let game = undefined;

$(document).ready(function() {
  // Initialization
  game = Game();
  game.init();

  // Events
  document.getElementById("display").addEventListener("click", game.setMouseClick);
  document.getElementById("display").addEventListener("dblclick", game.setDoubleMouseClick);
  window.addEventListener("resize", game.requestResize);
  window.addEventListener("mousemove",function(event) {
    game.setMousePosition(event.clientX, event.clientY);
  });

  let timer = setInterval(game.frame, 20);
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
