/**
* Game
*/

"use strict";

function Game() {
  // Settings
  let setting_hexagon_size = 30;
  let setting_hexagon_vertical = true;
  let setting_map_width = 50;
  let setting_map_height = 50;
  let setting_canvas_padding = 60; // Space between border and grid
  let setting_border_size = 6; // not used
  let setting_border_color = "black"; //not used
  let setting_interval_time = 20;
  // End settings

  // Components
  let display;
  let map;
  let hexagon;
  let keyboard;
  let timer;

  // Events flags
  let need_resize = false;

  /**
  * Init the game
  */
  function init() {
    // Init Keyboard
    keyboard = Input();

    // Init hexagon
    hexagon = Hexagone(setting_hexagon_size, setting_hexagon_vertical);
    map = Map();
    map.createEmptyMap(setting_map_width,setting_map_height);

    // Init playground
    // Compute the size of the playground
    let playground_width = 2*setting_canvas_padding+setting_map_width*hexagon.getWidth();
    let playground_height = 2*setting_canvas_padding+setting_map_height*hexagon.getHeight();

    // Init display
    display = Display();
    display.init(playground_width,playground_height,setting_border_size);
    display.resize();

    //Init timer
    timer = setInterval(frame, setting_interval_time);
  }

  /**
  * Draw the map
  */
  function drawHexagons() {

    let decalage = 0;
    let hex_center = undefined;

    for (let i = 0; i < map.getHeight(); i++) {
      if (i % 2 == 0) {
        decalage = 0;
      } else {
        decalage = hexagon.getHorizontalDistance()/2;
      }
      for (let j = 0; j < map.getWidth(); j++) {
        hex_center = Point(setting_canvas_padding+j*hexagon.getHorizontalDistance()+decalage,setting_canvas_padding+i*hexagon.getVerticalDistance());
        display.drawHexagon(hex_center,hexagon,"#057d9f", false);
    }
  }
  }

  function frame() {
    if (need_resize) {
      display.resize();
      need_resize = false;
    }

    //Draw
    display.draw();
    drawHexagons();

    //Keyboard
    if(keyboard.getKeyState("shift")) {
        display.speedUp();
    }
    if (keyboard.getKeyState("w")) {
        display.moveCameraUp();
    }
    if (keyboard.getKeyState("s")) {
        display.moveCameraDown();
    }
    if (keyboard.getKeyState("a")) {
      display.moveCameraLeft();
    }
    if (keyboard.getKeyState("d")) {
      display.moveCameraRight();
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
      keyboard.setKeyState(pKey,true);
    },
    keyUp: function(pKey) {
      keyboard.setKeyState(pKey,false);
    },
    setMousePosition: function(pX,pY) {
      keyboard.setMousePosition(pX,pY);
    },
    setMouseClick: function() {
      keyboard.setMouseClick();
    },
    setDoubleMouseClick: function() {
      keyboard.setDoubleMouseClick();
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

  let timer = setInterval(game.frame, 20)
});

$(document).keydown(function(event) {
  if(event.keyCode == 16 ) {
    game.keyDown("shift");
  }
  if(event.keyCode == 87 ) {
    game.keyDown("w");
  }
  if(event.keyCode == 83 ) {
    game.keyDown("s");
  }
  if(event.keyCode == 65 ) {
    game.keyDown("a");
  }
  if(event.keyCode == 68 ) {
    game.keyDown("d");
  }
});

$(document).keyup(function(event) {
  if(event.keyCode == 16 ) {
    game.keyUp("shift");
  }
  if(event.keyCode == 87 ) {
    game.keyUp("w");
  }
  if(event.keyCode == 83 ) {
    game.keyUp("s");
  }
  if(event.keyCode == 65 ) {
    game.keyUp("a");
  }
  if(event.keyCode == 68 ) {
    game.keyUp("d");
  }
});
